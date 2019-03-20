import * as algolia from 'algoliasearch'
import * as probot from 'probot'
import * as Yup from 'yup'

import { Prisma } from '../generated/prisma-client'

/* Setup */

const client = algolia(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)
const index = client.initIndex('BOILERPLATES')

const prisma = new Prisma({
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
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
      handleRepositoryInstallation(ctx, { repo, owner }),
    )
    const removals = ctx.payload.repositories_removed.map((repo: string) =>
      handleRepositoryRemoval(ctx, { repo, owner }),
    )

    await Promise.all([...installations, ...removals])
  })

  /**
   * Updates the boilerplates indexing with new configuration.
   */
  app.on('push', async (ctx: probot.Context) =>
    handleRepositoryInstallation(ctx, ctx.repo()),
  )
}

/**
 * Helper functions
 *
 * Functions below help with the handling of webhook events.
 */

export interface BoilerplateConfig {
  name: string
  description: string
  branch: string
  path: string
}

export interface Config {
  boilerplates: BoilerplateConfig[]
}

export const boilerplateSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
  branch: Yup.string().required(),
  path: Yup.string().required(),
})

export const schema = Yup.object().shape({
  boilerplates: Yup.array()
    .of(boilerplateSchema)
    .required(),
})

/**
 *
 * Retrives config from the installed repository.
 *
 * @param ctx
 */
export async function getConfig(ctx: probot.Context): Promise<Config | null> {
  const config = ctx.config
  return null
}

interface GithubRepository {
  owner: string
  repo: string
}

/**
 *
 * Processes repository boilerplates by updating database and indexing
 * Algolia for search.
 *
 * @param ctx
 * @param repo
 */
export async function handleRepositoryInstallation(
  ctx: probot.Context,
  repo: GithubRepository,
): Promise<void> {
  /**
   * 1. Obtains the config.
   * 2. Loads existing boilerplates.
   * 3. Indexes everything in Algolia.
   */
  const config = await getConfig(ctx)

  /* istanbul ignore if */
  if (!config) return

  // TODO: diff added, removed

  const boilerplates = config.boilerplates.map(handleBoilerplate)

  await Promise.all(boilerplates)

  /* Helper functions */

  async function handleBoilerplate(
    boilerplateConfiguration: BoilerplateConfig,
  ): Promise<void> {
    const boilerplate = await prisma.boilerplate({
      name: boilerplateConfiguration.name,
    })

    /* istanbul ignore if */
    if (
      boilerplate !== null &&
      (boilerplate.owner !== repo.owner || boilerplate.repository !== repo.repo)
    ) {
      return
    }

    const newBoilerplate = await prisma.createBoilerplate({
      ...boilerplateConfiguration,
      owner: repo.owner,
      repository: repo.repo,
    })

    index.saveObject({
      ...newBoilerplate,
      objectID: newBoilerplate.name,
    })
  }
}

/**
 *
 * Removes boilerplates associated with a repository.
 *
 * @param ctx
 * @param repo
 */
export async function handleRepositoryRemoval(
  ctx: probot.Context,
  repo: GithubRepository,
): Promise<void> {
  await prisma.deleteManyBoilerplates({
    repository: repo.repo,
    owner: repo.owner,
  })

  await index.deleteBy({
    repository: repo.repo,
    owner: repo.owner,
  })
}
