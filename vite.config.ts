import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.svg', 'data/pokeraw.json', 'data/cartas_tcg.json'],
      manifest: {
        name: 'Pokédex Web Experience',
        short_name: 'Pokédex',
        description: 'Aplicação web interativa de Pokédex, batalhas, tipos, Quiz e Safari.',
        theme_color: '#FFCB05',
        background_color: '#0B0E14',
        display: 'standalone',
        icons: [
          {
            src: '/icons/electric.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024, // 15 MB para acomodar dados completos
        globPatterns: ['**/*.{js,css,html,svg,png,json}'],
      },
    }),
  ],
  server: {
    port: 3000,
  },
});
