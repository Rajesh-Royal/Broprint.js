/**
 * Audio fingerprint tests.
 *
 * `OfflineAudioContext` is not available in node or jsdom. Tests install a
 * configurable mock onto `globalThis.window` before each call. The mock
 * captures setValueAtTime invocations so we can assert compressor params,
 * and lets each test override the channel data the rendering "produces".
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getAudioFingerprint } from '../generateTheAudioPrints';

type SetValueCall = { name: string; value: number; when: number };

interface MockHandle {
    contexts: MockContext[];
    setValueCalls: SetValueCall[];
}

class MockAudioParam {
    constructor(
        private name: string,
        private sink: SetValueCall[]
    ) {}
    setValueAtTime(value: number, when: number): void {
        this.sink.push({ name: this.name, value, when });
    }
}

class MockOscillator {
    type = '';
    frequency = new MockAudioParam('frequency', []);
    connected: unknown = null;
    started = false;
    connect(target: unknown): void {
        this.connected = target;
    }
    start(_when: number): void {
        this.started = true;
    }
}

class MockCompressor {
    threshold: MockAudioParam;
    knee: MockAudioParam;
    ratio: MockAudioParam;
    attack: MockAudioParam;
    release: MockAudioParam;
    connected: unknown = null;
    disconnected = false;
    constructor(sink: SetValueCall[]) {
        this.threshold = new MockAudioParam('threshold', sink);
        this.knee = new MockAudioParam('knee', sink);
        this.ratio = new MockAudioParam('ratio', sink);
        this.attack = new MockAudioParam('attack', sink);
        this.release = new MockAudioParam('release', sink);
    }
    connect(target: unknown): void {
        this.connected = target;
    }
    disconnect(): void {
        this.disconnected = true;
    }
}

interface MockContextOptions {
    channelData?: Float32Array;
    failRender?: boolean;
}

class MockContext {
    currentTime = 0;
    destination = { id: 'destination' };
    oncomplete: ((e: { renderedBuffer: { getChannelData: () => Float32Array } }) => void) | null =
        null;
    osc: MockOscillator | null = null;
    comp: MockCompressor | null = null;
    constructor(
        private options: MockContextOptions,
        private setValueSink: SetValueCall[]
    ) {}
    createOscillator(): MockOscillator {
        this.osc = new MockOscillator();
        return this.osc;
    }
    createDynamicsCompressor(): MockCompressor {
        this.comp = new MockCompressor(this.setValueSink);
        return this.comp;
    }
    startRendering(): void {
        if (this.options.failRender) {
            throw new Error('mock render failure');
        }
        // Fire oncomplete asynchronously to mirror the real API.
        queueMicrotask(() => {
            this.oncomplete?.({
                renderedBuffer: {
                    getChannelData: () =>
                        this.options.channelData ?? new Float32Array(5000).fill(0.001)
                }
            });
        });
    }
}

const installMock = (options: MockContextOptions = {}): MockHandle => {
    const handle: MockHandle = { contexts: [], setValueCalls: [] };
    const Ctor = vi.fn((_channels: number, _length: number, _rate: number) => {
        const ctx = new MockContext(options, handle.setValueCalls);
        handle.contexts.push(ctx);
        return ctx;
    });
    (globalThis as unknown as { window: Record<string, unknown> }).window = {
        OfflineAudioContext: Ctor as unknown
    };
    return handle;
};

const removeMock = (): void => {
    delete (globalThis as unknown as { window?: unknown }).window;
};

describe('getAudioFingerprint', () => {
    beforeEach(() => {
        removeMock();
    });
    afterEach(() => {
        removeMock();
        vi.restoreAllMocks();
    });

    it('rejects when OfflineAudioContext is unavailable', async () => {
        (globalThis as unknown as { window: Record<string, unknown> }).window = {};
        await expect(getAudioFingerprint()).rejects.toThrow(/OfflineAudioContext/);
    });

    it('rejects when window itself is undefined', async () => {
        await expect(getAudioFingerprint()).rejects.toThrow(/OfflineAudioContext/);
    });

    it('rejects when startRendering throws synchronously', async () => {
        installMock({ failRender: true });
        await expect(getAudioFingerprint()).rejects.toThrow(/mock render failure/);
    });

    it('resolves to a string for the happy path', async () => {
        installMock();
        const out = await getAudioFingerprint();
        expect(typeof out).toBe('string');
    });

    it('does NOT prefix output with the literal "null" (regression for #23)', async () => {
        // Each sample is 0.0001; |sum| over [4500, 5000) = 500 * 0.0001 = 0.05.
        const data = new Float32Array(5000).fill(0.0001);
        installMock({ channelData: data });
        const out = await getAudioFingerprint();
        expect(out.startsWith('null')).toBe(false);
        expect(out).not.toContain('null');
        expect(Number(out)).toBeCloseTo(0.05, 4);
    });

    it('is deterministic — identical input produces identical output', async () => {
        const data = new Float32Array(5000).fill(0.002);
        installMock({ channelData: data });
        const a = await getAudioFingerprint();
        installMock({ channelData: data });
        const b = await getAudioFingerprint();
        expect(a).toBe(b);
    });

    it('two concurrent calls resolve independently (regression for #22)', async () => {
        // Each call gets its own mock context with its own channel data.
        // Interleave the installs by alternating before each call.
        const dataA = new Float32Array(5000).fill(0.001);
        const dataB = new Float32Array(5000).fill(0.003);

        installMock({ channelData: dataA });
        const pA = getAudioFingerprint();
        installMock({ channelData: dataB });
        const pB = getAudioFingerprint();

        const [a, b] = await Promise.all([pA, pB]);
        expect(a).not.toBe(b);
        // |sum| over 500 samples of 0.001 = 0.5; of 0.003 = 1.5.
        expect(Number(a)).toBeCloseTo(0.5, 5);
        expect(Number(b)).toBeCloseTo(1.5, 5);
    });

    it('configures compressor parameters with the documented values', async () => {
        const handle = installMock();
        await getAudioFingerprint();
        const byName = (n: string) => handle.setValueCalls.filter((c) => c.name === n);
        expect(byName('threshold')[0]?.value).toBe(-50);
        expect(byName('knee')[0]?.value).toBe(40);
        expect(byName('ratio')[0]?.value).toBe(12);
        expect(byName('attack')[0]?.value).toBe(0);
        expect(byName('release')[0]?.value).toBe(0.25);
    });

    it('falls back to webkitOfflineAudioContext when the standard ctor is missing', async () => {
        const handle: MockHandle = { contexts: [], setValueCalls: [] };
        const Ctor = vi.fn((_c: number, _l: number, _r: number) => {
            const ctx = new MockContext({}, handle.setValueCalls);
            handle.contexts.push(ctx);
            return ctx;
        });
        (globalThis as unknown as { window: Record<string, unknown> }).window = {
            webkitOfflineAudioContext: Ctor
        };
        const out = await getAudioFingerprint();
        expect(typeof out).toBe('string');
        expect(Ctor).toHaveBeenCalledTimes(1);
    });

    it('disconnects the compressor after rendering completes', async () => {
        const handle = installMock();
        await getAudioFingerprint();
        expect(handle.contexts[0].comp?.disconnected).toBe(true);
    });
});
