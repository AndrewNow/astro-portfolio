// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  image: {
    domains: ["astro.build", "iiodzelpjz.ufs.sh"],
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['three']
    },
    assetsInclude: ['**/*.glsl']
  },
});