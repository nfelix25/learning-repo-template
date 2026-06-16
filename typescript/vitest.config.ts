import { defineConfig } from "vitest/config"

export default defineConfig({
  esbuild: {
    target: "es2025",
  },
  test: {
    include: ["src/koans/**/*.ts"],
    exclude: ["src/koans/k-054-side-effect-module.ts"],
    typecheck: {
      enabled: false,
    },
  },
})
