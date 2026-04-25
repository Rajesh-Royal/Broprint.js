import { cyrb53 } from './code/EncryptDecrypt';
import { getCanvasFingerprint } from './code/GenerateCanvasFingerprint';
import { generateAudioFingerprint } from './code/generateTheAudioPrints';

/**
 * Generate a stable fingerprint for the current browser.
 *
 * Combines the audio fingerprint with the canvas fingerprint and hashes the
 * concatenation with cyrb53. If audio fingerprinting fails (e.g. unsupported
 * browser), falls back to a canvas-only fingerprint.
 *
 * @returns Promise resolving to the fingerprint as a string.
 * @throws if both audio and canvas fingerprinting fail.
 */
export async function getCurrentBrowserFingerPrint(): Promise<string> {
    try {
        const audioResult = await generateAudioFingerprint();
        const combined = window.btoa(audioResult) + getCanvasFingerprint();
        return cyrb53(combined, 0).toString();
    } catch {
        try {
            return cyrb53(getCanvasFingerprint(), 0).toString();
        } catch {
            throw new Error('Failed to generate the fingerprint of this browser');
        }
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
