import algolia from 'algoliasearch'
import * as probot from 'probot'

import {
  handleRepositoryInstallation,
  handleRepositoryRemoval,
} from '../boilerplates'
import { Prisma } from '../generated/prisma-client'

/* Setup */

const client = algolia(
  process.env.ALGOLIA_APP_ID!,
  process.env.ALGOLIA_API_KEY!,
)
const index = client.initIndex('BOILERPLATES')

const prisma = new Prisma({
  endpoint: process.env.PRISMA_ENDPOINT!,
  secret: process.env.PRISMA_SECRET!,
})

/* Application */

export const hooks = (app: probot.Application): void => {
  /**
   * Triggered whenever repository is installed or uninstalled.
   * Handles initial configuration setup and clearings.
   */
  app.on('installation', async (ctx: probot.Context) => {
    const owner = ctx.payload.installation.account.login
    const installations = ctx.payload.repositories_added.map((repo: string) =>
      handleRepositoryInstallation(ctx.github, index, prisma, { repo, owner }),
    )
    const removals = ctx.payload.repositories_removed.map((repo: string) =>
      handleRepositoryRemoval(index, prisma, { repo, owner }),
    )

    await Promise.all([...installations, ...removals])
  })

  /**
   * Updates the boilerplates indexing with new configuration.
   */
  app.on('push', async (ctx: probot.Context) =>
    handleRepositoryInstallation(ctx.github, index, prisma, ctx.repo()),
  )
}
