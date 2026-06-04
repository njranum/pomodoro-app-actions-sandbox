import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

const buildMeta = {
  __APP_VERSION__: JSON.stringify(
    (process.env.APP_VERSION ?? process.env.npm_package_version ?? '0.0.0').replace(/^v/, '')
  ),
  __COMMIT_HASH__: JSON.stringify((process.env.GITHUB_SHA ?? 'local-dev').slice(0, 7)),
  __BUILD_DATE__: JSON.stringify(new Date().toISOString())
}

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    define: buildMeta,
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()]
  }
})
