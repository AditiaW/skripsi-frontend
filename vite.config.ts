import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "maskable-icon.png",
        "robots.txt",
        "*.svg"
      ],
      manifest: {
        name: "GM Candra Mebel Shop",
        short_name: "GM Candra Mebel",
        description: "Aplikasi GM Candra Mebel Shop",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        id: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ],
        categories: ["shopping", "furniture"]
      },
      workbox: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,woff2,woff,ttf,json}'
        ],

        runtimeCaching: [
          // 📦 Produk dari API
          {
            urlPattern: /\/api\/products/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'products-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, 
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          // 🖼️ Gambar: Cache First
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
              },
            },
          },
        ],

        navigateFallback: '/index.html',
        navigateFallbackDenylist: [
          /^\/api\/.*$/,
          /^\/auth\/.*$/,
        ],

        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: false,
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3MB
      },
      devOptions: {
        enabled: true,
        type: "module",
        navigateFallback: "index.html"
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1600
  }
});
