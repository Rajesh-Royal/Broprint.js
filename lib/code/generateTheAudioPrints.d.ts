type OfflineAudioContextCtor = typeof OfflineAudioContext;
declare global {
    interface Window {
        webkitOfflineAudioContext?: OfflineAudioContextCtor;
    }
}
/**
 * Generate an audio fingerprint by rendering a fixed oscillator + compressor
 * graph through OfflineAudioContext and summing a slice of the output buffer.
 * Different browsers/audio stacks produce subtly different float values,
 * yielding a stable per-browser identifier.
 *
 * Each invocation creates its own OfflineAudioContext and resolves
 * independently — safe for concurrent calls.
 *
 * @returns Promise resolving to the fingerprint as a string
 * @throws if OfflineAudioContext is not available in the runtime
 */
export declare const getAudioFingerprint: () => Promise<string>;
export {};
