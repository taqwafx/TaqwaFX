// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],

      manifest: {
        name: 'TaqwaFX',
        short_name: 'TaqwaFX',
        description: 'TaqwaFX Investment Management Platform',
        
        theme_color: '#ffffff',
        background_color: '#ffffff',
        
        display: 'standalone',   // 🔥 MUST
        scope: '/',              // 🔥 MUST
        start_url: '/',          // 🔥 MUST

        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },

      devOptions: {
        enabled: true // 🔥 VERY IMPORTANT for testing
      }
    })
  ]
})