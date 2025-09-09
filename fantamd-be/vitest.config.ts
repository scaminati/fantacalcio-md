import { defineConfig } from 'vitest/config'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.test' })

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    coverage: {
      include: ['src']
    },
    setupFiles: ['./test/test-setup.ts'],
    globalSetup: './test/global-setup.ts'
  }
})
