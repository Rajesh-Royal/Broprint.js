/**
 * Whether the runtime supports HTML5 canvas with a 2D context.
 * @returns true if canvas+2d is available, false otherwise
 */
export declare const isCanvasSupported: () => boolean;
/**
 * Render a fixed text + shapes to a canvas and return its dataURL. Different
 * browsers/GPUs render with subtle pixel differences, producing a stable
 * per-browser identifier.
 *
 * Returns the literal string `'broprint.js'` if canvas is unsupported.
 *
 * @returns canvas dataURL (or fallback string)
 */
export declare const getCanvasFingerprint: () => string;
