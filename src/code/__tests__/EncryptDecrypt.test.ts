import { describe, it, expect } from 'vitest';
import { cyrb53 } from '../EncryptDecrypt';

describe('cyrb53', () => {
    it('produces a known golden value for "hello" with default seed', () => {
        expect(cyrb53('hello')).toBe(4625896200565286);
    });

    it('is idempotent — same input yields the same output', () => {
        const a = cyrb53('the quick brown fox');
        const b = cyrb53('the quick brown fox');
        expect(a).toBe(b);
    });

    it('distributes — distinct inputs yield distinct outputs', () => {
        const inputs = ['a', 'b', 'aa', 'ab', 'ba', 'foo', 'bar', 'baz'];
        const hashes = new Set(inputs.map((s) => cyrb53(s)));
        expect(hashes.size).toBe(inputs.length);
    });

    it('handles the empty string', () => {
        expect(cyrb53('')).toBe(3338908027751811);
    });

    it('handles surrogate-pair emoji', () => {
        expect(cyrb53('🦀')).toBe(2047232595828226);
    });

    it('handles multi-byte CJK characters', () => {
        expect(cyrb53('日本語')).toBe(179667132864817);
    });

    it('handles a very long input without crashing', () => {
        // 100,000 characters — also serves as a smoke test for perf regressions.
        const long = 'a'.repeat(100000);
        expect(cyrb53(long)).toBe(2235772107299468);
    });

    it('produces different output for different seeds', () => {
        const seed0 = cyrb53('hello', 0);
        const seed1 = cyrb53('hello', 1);
        expect(seed0).not.toBe(seed1);
        expect(seed1).toBe(6922249475667011);
    });

    it('defaults seed to 0 when omitted', () => {
        expect(cyrb53('foo')).toBe(cyrb53('foo', 0));
    });

    it('returns a non-negative finite integer in the 53-bit range', () => {
        const h = cyrb53('arbitrary input string');
        expect(Number.isFinite(h)).toBe(true);
        expect(h).toBeGreaterThanOrEqual(0);
        expect(h).toBeLessThan(2 ** 53);
        expect(Number.isInteger(h)).toBe(true);
    });
});
