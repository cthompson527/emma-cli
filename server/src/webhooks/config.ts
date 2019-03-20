import * as probot from 'probot'
import * as Yup from 'yup'

export interface BoilerplateConfig {
  name: string
  description: string
  branch: string
  path: string
}

export interface Config {
  boilerplates: BoilerplateConfig
}

export const schema = Yup.object().shape({
  boilerplates: Yup.object()
    .shape({
      name: Yup.string().required(),
      description: Yup.string().required(),
      branch: Yup.string().required(),
      path: Yup.string().required(),
    })
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
