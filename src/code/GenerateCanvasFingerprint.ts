/**
 * Whether the runtime supports HTML5 canvas with a 2D context.
 * @returns true if canvas+2d is available, false otherwise
 */
export const isCanvasSupported = (): boolean => {
    const elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
};

// this working code snippet is taken from - https://github.com/artem0/canvas-fingerprinting/blob/master/fingerprinting/fingerprint.js

/**
 * Render a fixed text + shapes to a canvas and return its dataURL. Different
 * browsers/GPUs render with subtle pixel differences, producing a stable
 * per-browser identifier.
 *
 * Returns the literal string `'broprint.js'` if canvas is unsupported.
 *
 * @returns canvas dataURL (or fallback string)
 */
export const getCanvasFingerprint = (): string => {
    // If canvas is not supported simply return a static string
    if (!isCanvasSupported()) return 'broprint.js';

    // draw a canvas of given text and return its data uri
    // different browser generates different dataUri based on their hardware configs
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // https://www.browserleaks.com/canvas#how-does-it-work
    const txt = 'BroPrint.65@345876';
    ctx!.textBaseline = 'top';
    ctx!.font = "14px 'Arial'";
    ctx!.textBaseline = 'alphabetic';
    ctx!.fillStyle = '#f60';
    ctx!.fillRect(125, 1, 62, 20);
    ctx!.fillStyle = '#069';
    ctx!.fillText(txt, 2, 15);
    ctx!.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx!.fillText(txt, 4, 17);
    return canvas.toDataURL();
};
