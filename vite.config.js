import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      manifest: {
        name: 'linkify',
        short_name: 'linkify',
        description: 'Una aplicacion para organizar y registrar enlaces',
        start_url: '/',
        display: 'fullscreen',
        background_color: '#164773',
        theme_color: '#012340',
        icons: [
          {
            src: "/molecular.png",
            sizes: "250x250",
            type: "image/png"
          },
          {
            src:"/icono-192-192.png",
            sizes:"192x192",
            type:"image/png",
            purpose: 'maskable',
          },
          
        ]
      },
      // share_target: {
      //   action: "/compartir",
      //   method: "GET",
      //   enctype: "application/x-www-form-urlencoded",
      //   params: {
      //     url: "url"
      //   }
      // },
      workbox: {
        clientsClaim: true,
        skipWaiting: true
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
