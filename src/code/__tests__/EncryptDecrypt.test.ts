import { describe, it, expect } from "vitest";
// @ts-ignore — these helpers are currently typed implicitly
// (the source uses `// @ts-nocheck`). This PR adds tests, not
// type fixes; tightening types is a separate follow-up.
import {
    cyrb53,
    javaHashCode,
    murmurhash3_32_gc,
} from "../EncryptDecrypt";

describe("cyrb53", () => {
    it("returns the documented golden value for 'hello'", () => {
        // The reference comment in EncryptDecrypt.ts shows the
        // shape of cyrb53 output (`output - 6533356943844037`).
        // This test pins down the exact value for one input so
        // any accidental algorithm change becomes a test failure
        // instead of a silent fingerprint shift across releases.
        expect(cyrb53("hello")).toBe(4625896200565286);
    });

    it("is idempotent: same input twice → same output", () => {
        const a = cyrb53("the quick brown fox");
        const b = cyrb53("the quick brown fox");
        expect(a).toBe(b);
    });

    it("distributes: different inputs → different outputs", () => {
        const inputs = ["a", "b", "ab", "ba", "aa", "bb", "hello", "Hello"];
        const outputs = new Set(inputs.map((s) => cyrb53(s)));
        expect(outputs.size).toBe(inputs.length);
    });

    it("handles the empty string", () => {
        expect(cyrb53("")).toBe(3338908027751811);
    });

    it("handles unicode (emoji and CJK)", () => {
        // Non-throwing + deterministic + non-zero coverage of
        // the multi-byte char-code path.
        expect(cyrb53("🎉")).toBe(3901993976494536);
        expect(cyrb53("你好")).toBe(697135493569599);
    });

    it("handles a very long string without crashing", () => {
        const big = "a".repeat(100_000);
        const h = cyrb53(big);
        expect(typeof h).toBe("number");
        expect(Number.isFinite(h)).toBe(true);
        // Idempotent on long input too.
        expect(cyrb53(big)).toBe(h);
    });

    it("produces different outputs for different seeds", () => {
        expect(cyrb53("hello", 0)).not.toBe(cyrb53("hello", 1));
        expect(cyrb53("hello", 1)).not.toBe(cyrb53("hello", 2));
    });

    it("defaults the seed parameter to 0", () => {
        expect(cyrb53("hello")).toBe(cyrb53("hello", 0));
    });

    it("is bounded: result is a non-negative finite number", () => {
        // cyrb53 mixes a 21-bit upper half with a 32-bit lower
        // half, so the value fits well inside Number.MAX_SAFE_INTEGER.
        for (const s of ["", "a", "hello world", "🎉🎊"]) {
            const h = cyrb53(s);
            expect(h).toBeGreaterThanOrEqual(0);
            expect(h).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
            expect(Number.isFinite(h)).toBe(true);
        }
    });
});

describe("javaHashCode", () => {
    it("returns 0 for empty string", () => {
        expect(javaHashCode("", 1)).toBe(0);
    });

    it("is deterministic", () => {
        expect(javaHashCode("hello", 1)).toBe(javaHashCode("hello", 1));
    });

    it("matches a pinned golden value (K=1)", () => {
        expect(javaHashCode("hello", 1)).toBe(99162322);
    });

    it("varies with the multiplier K", () => {
        expect(javaHashCode("hello", 1)).not.toBe(javaHashCode("hello", 31));
    });
});

describe("murmurhash3_32_gc", () => {
    it("returns 0 for empty string", () => {
        expect(murmurhash3_32_gc("", 0)).toBe(0);
    });

    it("is deterministic", () => {
        expect(murmurhash3_32_gc("hello", 0)).toBe(
            murmurhash3_32_gc("hello", 0),
        );
    });

    it("matches a pinned golden value", () => {
        expect(murmurhash3_32_gc("hello", 0)).toBe(613153351);
    });

    it("changes with the seed", () => {
        expect(murmurhash3_32_gc("hello", 0)).not.toBe(
            murmurhash3_32_gc("hello", 1),
        );
    });

    it("covers each tail-byte branch (length % 4 = 1, 2, 3)", () => {
        // remainder=1 → "abcde"
        expect(murmurhash3_32_gc("abcde", 0)).toBe(3902511862);
        // remainder=2 → "abcdef"
        expect(murmurhash3_32_gc("abcdef", 0)).toBe(3890699283);
        // remainder=3 → "abcdefg"
        expect(murmurhash3_32_gc("abcdefg", 0)).toBe(2447583035);
    });
});
