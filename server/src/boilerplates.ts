import algolia from 'algoliasearch'
import { diffBy } from 'diff-by'
import mls from 'multilines'
import Octokit from '@octokit/rest'
import * as Yup from 'yup'

import * as prisma from './generated/prisma-client'
import { withDefault } from './utils'

/* Constants */

const configFile = 'emma.json'

/* Boilerpaltes */

export interface BoilerplateConfig {
  name: string
  description: string
  branch: string
  path: string
}

export interface Config {
  boilerplates: BoilerplateConfig[]
}

const boilerplateSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
  branch: Yup.string().required(),
  path: Yup.string().required(),
})

const schema = Yup.object().shape({
  boilerplates: Yup.array()
    .of(boilerplateSchema)
    .required(),
})

/**
 *
 * Retrives config from a particular repository.
 *
 * @param ctx
 */
export async function getConfig(
  github: Octokit,
  repo: GithubRepository,
): Promise<Config | null> {
  try {
    // TODO: remove any on fixed typings
    const res: any = await github.repos.getContents({
      owner: repo.owner,
      repo: repo.repo,
      ref: withDefault('master')(repo.ref),
      path: configFile,
    })
    const config = await schema.validate(JSON.parse(res))

    return config
  } catch (err) {
    // TODO: handle configuration errors better
    return null
  }
}

export interface GithubRepository {
  owner: string
  repo: string
  ref?: string
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
  github: Octokit,
  search: algolia.Index,
  db: prisma.Prisma,
  repo: GithubRepository,
): Promise<void> {
  /**
   * 1. Obtains the config.
   * 2. Loads existing boilerplates.
   * 3. Compares existing boilerplates with new configuration.
   * 4. Submits changes to Prisma and Algolia.
   */
  const config = await getConfig(github, repo)

  /* istanbul ignore if */
  if (!config) return

  const boilerplates = await db.boilerplates({
    where: { owner: repo.owner, repository: repo.repo },
  })

  const { created, updated, deleted } = diffBy(
    b => b.name,
    boilerplates,
    config.boilerplates,
  )

  const actions = [
    ...created.map(addBoilerplate),
    ...updated.map(updateBoilerplate),
    ...deleted.map(deleteBoilerplate),
  ]

  await Promise.all(actions)

  /* Helper functions */

  async function addBoilerplate(
    boilerplateConfiguration: BoilerplateConfig,
  ): Promise<void> {
    const boilerplate = await db.boilerplate({
      name: boilerplateConfiguration.name,
    })

    /* istanbul ignore if */
    if (
      boilerplate !== null &&
      (boilerplate.owner !== repo.owner || boilerplate.repository !== repo.repo)
    ) {
      /**
       * Prevent installation of repositories with names that are already
       * taken by other people.
       */
      github.issues.create({
        owner: repo.owner,
        repo: repo.repo,
        title: `Emma Boilerplates name ${boilerplate.name} already taken.`,
        body: mls`
        | Hey :wave:,
        |
        | Thank you for using Emma Boilerplates! We noticed that you tried to
        | configure boilerplate for the name that is already taken. Consider
        | changing it to something similar in meaning but with different name.
        |
        | You can see which names are already taken by searching boilerplates
        | with Emma Create CLI.
        `,
      })
    } else {
      /**
       * Index boilerplates which comply with already existing boilerplates.
       */
      const newBoilerplate = await db.createBoilerplate({
        ...boilerplateConfiguration,
        owner: repo.owner,
        repository: repo.repo,
      })

      search.saveObject({
        ...newBoilerplate,
        objectID: newBoilerplate.name,
      })
    }
  }

  async function updateBoilerplate(
    boilerplateConfig: BoilerplateConfig,
  ): Promise<void> {
    /* Update existing boilerplate */
    const boilerplate = await db.updateBoilerplate({
      where: { name: boilerplateConfig.name },
      data: {
        ...boilerplateConfig,
        owner: repo.owner,
        repository: repo.repo,
      },
    })

    search.saveObject({
      ...boilerplate,
      objectID: boilerplate.name,
    })
  }

  /**
   *
   * Unindexes boilerplate from Algolia and removes its instance in Prisma.
   *
   * @param boilerplateConfig
   */
  async function deleteBoilerplate(
    boilerplateConfig: BoilerplateConfig,
  ): Promise<void> {
    await Promise.all([
      db.deleteBoilerplate({ name: boilerplateConfig.name }),
      search.deleteObject(boilerplateConfig.name),
    ])
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
  search: algolia.Index,
  db: prisma.Prisma,
  repo: GithubRepository,
): Promise<void> {
  await Promise.all([
    db.deleteManyBoilerplates({
      repository: repo.repo,
      owner: repo.owner,
    }),
    search.deleteBy({
      repository: repo.repo,
      owner: repo.owner,
    }),
  ])
}
