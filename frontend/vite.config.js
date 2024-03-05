import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginImp from 'vite-plugin-imp'

// https://vitejs.dev/config/

// less/antd config:
// https://stackoverflow.com/a/68245609

// moving proxy config from package.json to vite.config.js:
// https://stackoverflow.com/questions/64677212/how-to-configure-proxy-in-vite

// accessing .env variables in config:
// https://vitejs.dev/config/#using-environment-variables-in-config
// https://stackoverflow.com/questions/66389043/how-can-i-use-vite-env-variables-in-vite-config-js

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return defineConfig({
    plugins: [
      react(),
      vitePluginImp({
        libList: [
          {
            libName: 'antd',
            style: name => `antd/es/${name}/style`,
          },
        ],
      }),
    ],
    server: {
      proxy: {
        [env.VITE_REACT_APP_API_URL]: {
          target: 'http://localhost:4000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          relativeUrls: true,
          javascriptEnabled: true,
          modifyVars: {
            hack: `true; @import 'antd.customize.less'`,
          },
        },
      },
    },
    resolve: {
      alias: [{ find: /^~/, replacement: '' }],
    },
  })
}
