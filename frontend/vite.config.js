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
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err)
            })
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url)
            })
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url)
            })
          },
        },
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    resolve: {
      alias: [{ find: /^~/, replacement: '' }],
    },
  })
}
