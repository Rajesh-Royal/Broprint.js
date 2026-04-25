// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getCanvasFingerprint, isCanvasSupported } from '../GenerateCanvasFingerprint';

const mockCanvasElement = (overrides: Partial<HTMLCanvasElement> = {}) => {
    const realCreate = document.createElement.bind(document);
    return vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        const el = realCreate(tag);
        if (tag === 'canvas') {
            for (const [k, v] of Object.entries(overrides)) {
                Object.defineProperty(el, k, { value: v, configurable: true });
            }
        }
        return el;
    });
};

describe('isCanvasSupported', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns false when getContext is missing', () => {
        mockCanvasElement({ getContext: undefined as unknown as HTMLCanvasElement['getContext'] });
        expect(isCanvasSupported()).toBe(false);
    });

    it('returns false when getContext returns null', () => {
        mockCanvasElement({
            getContext: (() => null) as unknown as HTMLCanvasElement['getContext']
        });
        expect(isCanvasSupported()).toBe(false);
    });

    it('returns true when getContext returns a 2d context', () => {
        const fakeCtx = {} as CanvasRenderingContext2D;
        mockCanvasElement({
            getContext: ((id: string) =>
                id === '2d' ? fakeCtx : null) as unknown as HTMLCanvasElement['getContext']
        });
        expect(isCanvasSupported()).toBe(true);
    });
});

describe('getCanvasFingerprint', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns the fallback string when canvas is unsupported', () => {
        mockCanvasElement({ getContext: undefined as unknown as HTMLCanvasElement['getContext'] });
        expect(getCanvasFingerprint()).toBe('broprint.js');
    });

    it('invokes 2d drawing primitives with the expected arguments', () => {
        const fillRect = vi.fn();
        const fillText = vi.fn();
        const toDataURL = vi.fn(() => 'data:image/png;base64,STUB');
        const fakeCtx = {
            textBaseline: '',
            font: '',
            fillStyle: '',
            fillRect,
            fillText
        } as unknown as CanvasRenderingContext2D;

        mockCanvasElement({
            getContext: ((id: string) =>
                id === '2d' ? fakeCtx : null) as unknown as HTMLCanvasElement['getContext'],
            toDataURL: toDataURL as unknown as HTMLCanvasElement['toDataURL']
        });

        const result = getCanvasFingerprint();
        expect(result).toBe('data:image/png;base64,STUB');
        expect(fillRect).toHaveBeenCalledWith(125, 1, 62, 20);
        expect(fillText).toHaveBeenCalledTimes(2);
        expect(fillText).toHaveBeenNthCalledWith(1, 'BroPrint.65@345876', 2, 15);
        expect(fillText).toHaveBeenNthCalledWith(2, 'BroPrint.65@345876', 4, 17);
        expect(toDataURL).toHaveBeenCalledTimes(1);
    });

    it('produces identical output across repeated calls when context is deterministic', () => {
        const dataURI = 'data:image/png;base64,STABLE';
        const fakeCtx = {
            textBaseline: '',
            font: '',
            fillStyle: '',
            fillRect: vi.fn(),
            fillText: vi.fn()
        } as unknown as CanvasRenderingContext2D;

        mockCanvasElement({
            getContext: ((id: string) =>
                id === '2d' ? fakeCtx : null) as unknown as HTMLCanvasElement['getContext'],
            toDataURL: (() => dataURI) as unknown as HTMLCanvasElement['toDataURL']
        });

        expect(getCanvasFingerprint()).toBe(dataURI);
        expect(getCanvasFingerprint()).toBe(dataURI);
    });
});
