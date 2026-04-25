// reference - https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript#answer-52171480

/**
 * Fast, non-cryptographic 53-bit hash. Returns a deterministic integer in
 * the range [0, 2^53). Suitable for fingerprint hashing — not for security.
 *
 * @param str input string to hash
 * @param seed optional seed (default 0); different seeds produce different hashes
 * @returns 53-bit integer hash
 * @example cyrb53('hello') // 17202805693082
 */
export const cyrb53 = (str: string, seed: number = 0): number => {
    let h1 = 0xdeadbeef ^ seed;
    let h2 = 0x41c6ce57 ^ seed;
    for (let i = 0; i < str.length; i++) {
        const ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
