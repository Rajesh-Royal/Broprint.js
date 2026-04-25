import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        environmentMatchGlobs: [['src/**/__tests__/GenerateCanvasFingerprint.test.ts', 'jsdom']],
        include: ['src/**/__tests__/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            include: [
                'src/code/EncryptDecrypt.ts',
                'src/code/GenerateCanvasFingerprint.ts',
                'src/code/generateTheAudioPrints.ts'
            ],
            thresholds: {
                statements: 80,
                branches: 80,
                functions: 80,
                lines: 80
            }
        }
    }
});
