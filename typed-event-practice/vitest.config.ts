import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["koans/**/*.test.ts"],
    restoreMocks: true
  }
})
