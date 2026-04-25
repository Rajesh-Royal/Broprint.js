/**
 * Fast, non-cryptographic 53-bit hash. Returns a deterministic integer in
 * the range [0, 2^53). Suitable for fingerprint hashing — not for security.
 *
 * @param str input string to hash
 * @param seed optional seed (default 0); different seeds produce different hashes
 * @returns 53-bit integer hash
 * @example cyrb53('hello') // 17202805693082
 */
export declare const cyrb53: (str: string, seed?: number) => number;
