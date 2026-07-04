import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from 'vite-plugin-sitemap';

// Pages publiques indexables par les moteurs de recherche
// Les routes /administrator/* sont volontairement exclues (espace privé)
const publicRoutes = ['/', '/choose-plans', '/payments', '/payments-success'];

// https://vite.dev/config/
export default defineConfig({
    server: {
        port: 3000,
        host: '::',
    },
    plugins: [
        react(),
        tailwindcss(),
        sitemap({
            hostname: 'https://toncosmos.fr',
            dynamicRoutes: publicRoutes,
            outDir: 'dist',
            changefreq: 'weekly',
            priority: 0.8,
            lastmod: new Date(),
            readable: true,
            robots: [
                {
                    userAgent: '*',
                    allow: '/',
                    disallow: ['/administrator/'],
                },
            ],
        }),
    ],
    resolve: {
        tsconfigPaths: true,
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
});
