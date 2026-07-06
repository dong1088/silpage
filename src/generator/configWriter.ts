/**
 * configWriter.ts
 * 生成 Astro 项目的配置文件：package.json, astro.config.mjs, tsconfig.json, tailwind.config.mjs
 */

export interface AstroConfig {
  projectName: string;
  baseUrl?: string;
  siteTitle?: string;
}

/**
 * 生成 package.json
 */
export function generatePackageJson(config: AstroConfig): string {
  return JSON.stringify(
    {
      name: config.projectName.toLowerCase().replace(/\s+/g, "-"),
      version: "1.0.0",
      type: "module",
      scripts: {
        dev: "astro dev",
        build: "astro build",
        preview: "astro preview",
      },
      dependencies: {
        astro: "^5.0.0",
        "@astrojs/tailwind": "^6.0.0",
        "@astrojs/react": "^4.0.0",
        tailwindcss: "^4.0.0",
        "@tailwindcss/vite": "^4.0.0",
        react: "^19.0.0",
        "react-dom": "^19.0.0",
      },
    },
    null,
    2
  );
}

/**
 * 生成 astro.config.mjs
 */
export function generateAstroConfig(config: AstroConfig): string {
  const site = config.baseUrl ? `'${config.baseUrl}'` : "undefined";

  return `import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: ${site},
  output: "static",
  integrations: [tailwind(), react()],
});
`;
}

/**
 * 生成 tsconfig.json
 */
export function generateTsConfig(): string {
  return JSON.stringify(
    {
      extends: "astro/tsconfig/strict",
      compilerOptions: {
        jsx: "react-jsx",
        jsxImportSource: "react",
      },
    },
    null,
    2
  );
}

/**
 * 生成 tailwind.config.mjs
 */
export function generateTailwindConfig(): string {
  return `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;
}

/**
 * 生成 src/env.d.ts
 */
export function generateEnvDts(): string {
  return `/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
`;
}