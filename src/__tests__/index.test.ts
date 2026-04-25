// @vitest-environment jsdom
/**
 * Integration tests for the public entry point. Wires real cyrb53 + canvas
 * (mocked via document.createElement) and a mocked OfflineAudioContext, then
 * exercises every option combination + fallback path.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getCurrentBrowserFingerPrint } from '../index';

const installAudio = (channelValue: number | null) => {
    if (channelValue === null) {
        delete (window as unknown as Record<string, unknown>).OfflineAudioContext;
        delete (window as unknown as Record<string, unknown>).webkitOfflineAudioContext;
        return;
    }
    class MockParam {
        setValueAtTime(): void {
            /* no-op */
        }
    }
    class MockOscillator {
        type = '';
        frequency = new MockParam();
        connect(): void {
            /* no-op */
        }
        start(): void {
            /* no-op */
        }
    }
    class MockCompressor {
        threshold = new MockParam();
        knee = new MockParam();
        ratio = new MockParam();
        attack = new MockParam();
        release = new MockParam();
        connect(): void {
            /* no-op */
        }
        disconnect(): void {
            /* no-op */
        }
    }
    class MockCtx {
        currentTime = 0;
        destination = {};
        oncomplete:
            | ((e: { renderedBuffer: { getChannelData: () => Float32Array } }) => void)
            | null = null;
        createOscillator(): MockOscillator {
            return new MockOscillator();
        }
        createDynamicsCompressor(): MockCompressor {
            return new MockCompressor();
        }
        startRendering(): void {
            queueMicrotask(() => {
                this.oncomplete?.({
                    renderedBuffer: {
                        getChannelData: () => new Float32Array(5000).fill(channelValue)
                    }
                });
            });
        }
    }
    (window as unknown as Record<string, unknown>).OfflineAudioContext =
        MockCtx as unknown as typeof OfflineAudioContext;
};

const installCanvas = (dataURI: string | null) => {
    const realCreate = document.createElement.bind(document);
    return vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        const el = realCreate(tag);
        if (tag === 'canvas') {
            if (dataURI === null) {
                Object.defineProperty(el, 'getContext', { value: undefined, configurable: true });
            } else {
                const ctx = {
                    textBaseline: '',
                    font: '',
                    fillStyle: '',
                    fillRect: () => {},
                    fillText: () => {}
                };
                Object.defineProperty(el, 'getContext', {
                    value: () => ctx,
                    configurable: true
                });
                Object.defineProperty(el, 'toDataURL', {
                    value: () => dataURI,
                    configurable: true
                });
            }
        }
        return el;
    });
};

describe('getCurrentBrowserFingerPrint (integration)', () => {
    beforeEach(() => {
        installAudio(0.001);
    });
    afterEach(() => {
        vi.restoreAllMocks();
        installAudio(null);
    });

    it('returns a non-empty numeric string by default', async () => {
        installCanvas('data:image/png;base64,STABLE');
        const out = await getCurrentBrowserFingerPrint();
        expect(typeof out).toBe('string');
        expect(out.length).toBeGreaterThan(0);
        expect(/^\d+$/.test(out)).toBe(true);
    });

    it('is deterministic — same inputs produce same output', async () => {
        installCanvas('data:image/png;base64,STABLE');
        const a = await getCurrentBrowserFingerPrint();
        installCanvas('data:image/png;base64,STABLE');
        const b = await getCurrentBrowserFingerPrint();
        expect(a).toBe(b);
    });

    it('canvas-only mode still produces a fingerprint', async () => {
        installCanvas('data:image/png;base64,CANVAS_ONLY');
        const out = await getCurrentBrowserFingerPrint({ useAudio: false });
        expect(typeof out).toBe('string');
        expect(out.length).toBeGreaterThan(0);
    });

    it('audio-only mode still produces a fingerprint', async () => {
        installCanvas('data:image/png;base64,IGNORED');
        const out = await getCurrentBrowserFingerPrint({ useCanvas: false });
        expect(typeof out).toBe('string');
        expect(out.length).toBeGreaterThan(0);
    });

    it('throws when both signals are disabled', async () => {
        installCanvas('data:image/png;base64,X');
        await expect(
            getCurrentBrowserFingerPrint({ useAudio: false, useCanvas: false })
        ).rejects.toThrow(/at least one/);
    });

    it('different seeds produce different outputs for the same environment', async () => {
        installCanvas('data:image/png;base64,SEEDTEST');
        const seedDefault = await getCurrentBrowserFingerPrint();
        installCanvas('data:image/png;base64,SEEDTEST');
        const seed42 = await getCurrentBrowserFingerPrint({ seed: 42 });
        expect(seedDefault).not.toBe(seed42);
    });

    it('canvas-only output differs from audio+canvas output', async () => {
        installCanvas('data:image/png;base64,SAMECANVAS');
        const both = await getCurrentBrowserFingerPrint();
        installCanvas('data:image/png;base64,SAMECANVAS');
        const canvasOnly = await getCurrentBrowserFingerPrint({ useAudio: false });
        expect(both).not.toBe(canvasOnly);
    });

    it('falls back to canvas-only when audio is unavailable', async () => {
        installAudio(null);
        installCanvas('data:image/png;base64,FALLBACK');
        const fallback = await getCurrentBrowserFingerPrint();
        installCanvas('data:image/png;base64,FALLBACK');
        const explicitCanvas = await getCurrentBrowserFingerPrint({ useAudio: false });
        expect(fallback).toBe(explicitCanvas);
    });

    it('rejects when audio-only is requested but audio is unavailable', async () => {
        installAudio(null);
        installCanvas('data:image/png;base64,IGNORED');
        await expect(getCurrentBrowserFingerPrint({ useCanvas: false })).rejects.toThrow();
    });

    it('output never contains the literal string "null" (regression for #23)', async () => {
        installCanvas('data:image/png;base64,NONULL');
        const out = await getCurrentBrowserFingerPrint();
        expect(out).not.toContain('null');
    });
});
