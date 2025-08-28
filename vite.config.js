import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const manifestForPlugin = {
  registerType: "prompt",
  includeAssets: ['favicon.png'], // Removed unnecessary assets
  manifest: {
    name: "Isomatsoft Casino",
    short_name: "Isomatsoft App",
    description: "A casino app offering a wide variety of exciting casino games for users to enjoy and track their stats.",
    icons: [
      {
        src: "./icon-192x192.png",  // Essential icon
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "./favicon.png",  // Icon used on download prompt
        sizes: "512x512",
        type: "image/png",
        purpose: "any"  // Updated to ensure it shows on download
      },
      {
        src: './apple-touch-icon.png',  // Essential for Apple devices
        sizes: '180x180',
        type: 'image/png',
        purpose: 'apple touch icon'
      }
    ],
    theme_color: "#181818",
    background_color: "#e8eac2",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
  workbox: {
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
});
