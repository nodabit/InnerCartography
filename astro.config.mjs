// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sanity from '@sanity/astro';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages 배포 설정
  site: 'https://nodabit.github.io',
  base: '/InnerCartography/',
  output: 'static',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sanity({
    projectId: 'hyht3xt0',
    dataset: 'production',
    apiVersion: '2024-03-09',
    useCdn: false
  })]
});