export { cyrb53 } from './code/EncryptDecrypt';
export { getCanvasFingerprint, isCanvasSupported } from './code/GenerateCanvasFingerprint';
export { getAudioFingerprint } from './code/generateTheAudioPrints';
export interface BroprintOptions {
    /** Include audio fingerprinting signal (default: true) */
    useAudio?: boolean;
    /** Include canvas fingerprinting signal (default: true) */
    useCanvas?: boolean;
    /** Custom seed for the hash function (default: 0) */
    seed?: number;
}
/**
 * Generate a stable fingerprint for the current browser.
 *
 * Combines the configured signals (audio + canvas by default) and hashes the
 * result with cyrb53. If audio is enabled but fails (e.g. unsupported browser)
 * and canvas is also enabled, falls back to a canvas-only fingerprint.
 *
 * @param options optional signal selection and hash seed.
 * @returns Promise resolving to the fingerprint as a string.
 * @throws if no signals are enabled, or if all enabled signals fail.
 */
export declare function getCurrentBrowserFingerPrint(options?: BroprintOptions): Promise<string>;
