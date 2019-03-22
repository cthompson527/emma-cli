import {
  Config,
  getConfig,
  GithubRepository,
  handleRepositoryInstallation,
} from '../src/boilerplates'

import * as f from './__fixtures__/boilerplates'

describe('getConfig', () => {
  test('finds correct configuration', async () => {
    const config: Config = {
      boilerplates: [
        {
          name: 'test-boilerplate',
          description: 'this is a test boilerplate',
          branch: 'next',
          path: '/path',
        },
        {
          name: 'another-boilerplate',
          description: 'this is another test boilerplate',
          branch: 'next',
          path: '/another',
        },
      ],
    }

    const github = {
      repos: {
        getContents: jest.fn().mockResolvedValue(JSON.stringify(config)),
      },
    }

    const res = await getConfig(github as any, {
      owner: 'test-owner',
      repo: 'test-repo',
      ref: 'next',
    })

    expect(res).toEqual(config)
    expect(github.repos.getContents).toBeCalledWith({
      owner: 'test-owner',
      repo: 'test-repo',
      ref: 'next',
      path: 'emma.json',
    })
  })

  test('applies default branch to configuration', async () => {
    const config: Config = {
      boilerplates: [
        {
          name: 'test-boilerplate',
          description: 'this is a test boilerplate',
          branch: 'master',
          path: '/path',
        },
      ],
    }

    const github = {
      repos: {
        getContents: jest.fn().mockResolvedValue(JSON.stringify(config)),
      },
    }

    const res = await getConfig(github as any, {
      owner: 'test-owner',
      repo: 'test-repo',
    })

    expect(res).toEqual(config)
    expect(github.repos.getContents).toBeCalledWith({
      owner: 'test-owner',
      repo: 'test-repo',
      ref: 'master',
      path: 'emma.json',
    })
  })

  test('resoles to null on invalid configuration', async () => {
    const github = {
      repos: {
        getContents: jest.fn().mockResolvedValue(JSON.stringify({ a: 2 })),
      },
    }

    const res = await getConfig(github as any, {
      owner: 'test-owner',
      repo: 'test-repo',
    })

    expect(res).toEqual(null)
    expect(github.repos.getContents).toBeCalledWith({
      owner: 'test-owner',
      repo: 'test-repo',
      ref: 'master',
      path: 'emma.json',
    })
  })
})

describe('handleRepositoryInstallation', () => {
  test('correctly handles repository installation', async () => {
    const oldConfig: Config = {
      boilerplates: [
        f.boilerplates['changed-boilerplate-before'],
        f.boilerplates['removed-boilerplate'],
        f.boilerplates['unchanged-boilerplate'],
      ],
    }

    const config: Config = {
      boilerplates: [
        f.boilerplates['new-boilerplate'],
        f.boilerplates['unchanged-boilerplate'],
        f.boilerplates['changed-boilerplate'],
      ],
    }

    /* Mocks */

    const github = {
      repos: {
        getContents: jest.fn().mockResolvedValue(JSON.stringify(config)),
      },
      issues: {
        create: jest.fn(),
      },
    }

    const prisma = {
      boilerplate: jest
        .fn()
        .mockImplementation(({ name }: { name: string }) =>
          Promise.resolve((f.boilerplates as any)[name]),
        ),
      boilerplates: jest.fn().mockResolvedValue(oldConfig.boilerplates),
      createBoilerplate: jest
        .fn()
        .mockImplementation(arg => Promise.resolve(arg)),
      updateBoilerplate: jest
        .fn()
        .mockImplementation(({ data }) => Promise.resolve(data)),
      deleteBoilerplate: jest
        .fn()
        .mockImplementation(arg => Promise.resolve(arg)),
    }

    const algolia = {
      saveObject: jest.fn(),
      deleteObject: jest.fn(),
    }

    const repo: GithubRepository = {
      owner: 'test-owner',
      repo: 'test-repo',
    }

    /* Execution */

    await handleRepositoryInstallation(
      github as any,
      algolia as any,
      prisma as any,
      repo,
    )

    /* Tests */

    expect(github.repos.getContents).toBeCalledTimes(1)
    expect(github.issues.create).toBeCalledTimes(0)
    expect(prisma.boilerplate).toBeCalledTimes(1)
    expect(prisma.boilerplates).toBeCalledTimes(1)
    expect(prisma.createBoilerplate).toBeCalledTimes(1)
    expect(prisma.updateBoilerplate).toBeCalledTimes(1)
    expect(prisma.deleteBoilerplate).toBeCalledTimes(1)
    expect(algolia.saveObject).toBeCalledTimes(2)
    expect(algolia.deleteObject).toBeCalledTimes(1)
  })

  test.todo('skips indexing taken repository')
  test.todo('skips execution on no configuration')
})
