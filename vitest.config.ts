import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['src/**/__tests__/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            include: ['src/code/EncryptDecrypt.ts'],
            thresholds: {
                statements: 80,
                branches: 80,
                functions: 80,
                lines: 80
            }
        }
    }
});
