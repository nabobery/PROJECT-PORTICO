import type { DeployEnv } from './lib/site.ts'

declare const __PORTICO_DEPLOY_ENV__: DeployEnv

/** Build-time deploy environment, injected by vite.config.ts `define`. */
export const DEPLOY_ENV: DeployEnv = __PORTICO_DEPLOY_ENV__
