import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        include: ["src/**/__tests__/**/*.test.ts"],
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "lcov"],
            // Only measure coverage for modules that have
            // unit tests today. Future testing PRs (e.g. for
            // FingerPrint.ts and GenerateCanvasFingerprint.ts)
            // should widen this list as they land — that way
            // the 80% threshold actually fails CI on regressions
            // in covered code instead of being trivially missed
            // by uncovered files dragging the average down.
            include: ["src/code/EncryptDecrypt.ts"],
            exclude: ["src/**/__tests__/**"],
            thresholds: {
                functions: 80,
                lines: 80,
                branches: 80,
                statements: 80,
            },
        },
    },
});
