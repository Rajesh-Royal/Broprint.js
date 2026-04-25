import { cyrb53 } from './code/EncryptDecrypt';
import { getCanvasFingerprint } from './code/GenerateCanvasFingerprint';
import { generateAudioFingerprint } from './code/generateTheAudioPrints';

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
export async function getCurrentBrowserFingerPrint(options: BroprintOptions = {}): Promise<string> {
    const { useAudio = true, useCanvas = true, seed = 0 } = options;

    if (!useAudio && !useCanvas) {
        throw new Error(
            'getCurrentBrowserFingerPrint: at least one of useAudio or useCanvas must be true'
        );
    }

    if (useAudio) {
        try {
            const audioResult = await generateAudioFingerprint();
            const combined = useCanvas
                ? window.btoa(audioResult) + getCanvasFingerprint()
                : window.btoa(audioResult);
            return cyrb53(combined, seed).toString();
        } catch (audioError) {
            if (!useCanvas) {
                throw audioError;
            }
            // fall through to canvas-only fallback
        }
    }

    try {
        return cyrb53(getCanvasFingerprint(), seed).toString();
    } catch {
        throw new Error('Failed to generate the fingerprint of this browser');
    }
}

// Expose as a global for classic <script src> usage when a UMD/IIFE build is loaded.
// Bundlers/tree-shakers ignore this in ESM contexts.
try {
    if (
        typeof window !== 'undefined' &&
        !(window as unknown as Record<string, unknown>).getCurrentBrowserFingerPrint
    ) {
        (window as unknown as Record<string, unknown>).getCurrentBrowserFingerPrint =
            getCurrentBrowserFingerPrint;
    }
} catch {
    /* no-op */
}
