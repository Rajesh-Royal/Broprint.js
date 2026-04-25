// ref - https://github.com/rickmacgillis/audio-fingerprint/blob/master/audio-fingerprinting.js
// Per-call function-scoped state. Concurrent invocations don't share fingerprint/callback.

type OfflineAudioContextCtor = typeof OfflineAudioContext;

declare global {
    interface Window {
        webkitOfflineAudioContext?: OfflineAudioContextCtor;
    }
}

type CompressorParamName = 'threshold' | 'knee' | 'ratio' | 'attack' | 'release';

const setCompressorParam = (
    compressor: DynamicsCompressorNode,
    name: CompressorParamName,
    value: number,
    when: number
): void => {
    const param = compressor[name] as AudioParam | undefined;
    if (param && typeof param.setValueAtTime === 'function') {
        param.setValueAtTime(value, when);
    }
};

export const generateAudioFingerprint = (): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        try {
            const Ctor: OfflineAudioContextCtor | undefined =
                typeof window !== 'undefined'
                    ? window.OfflineAudioContext || window.webkitOfflineAudioContext
                    : undefined;

            if (!Ctor) {
                reject(new Error('OfflineAudioContext is not supported in this environment'));
                return;
            }

            const context = new Ctor(1, 44100, 44100);
            const currentTime = context.currentTime;

            const oscillator = context.createOscillator();
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(10000, currentTime);

            const compressor = context.createDynamicsCompressor();
            setCompressorParam(compressor, 'threshold', -50, currentTime);
            setCompressorParam(compressor, 'knee', 40, currentTime);
            setCompressorParam(compressor, 'ratio', 12, currentTime);
            setCompressorParam(compressor, 'attack', 0, currentTime);
            setCompressorParam(compressor, 'release', 0.25, currentTime);

            oscillator.connect(compressor);
            compressor.connect(context.destination);
            oscillator.start(0);

            context.oncomplete = (event: OfflineAudioCompletionEvent) => {
                // Initialize accumulator to 0 (numeric). Previous code initialized to null
                // and used `+=`, which coerced the first concatenation to "null0.0001…",
                // baking the literal string "null" into every fingerprint. Fixing this
                // changes the audio fingerprint output for all consumers — breaking change,
                // see MIGRATION.md (v3.0.0).
                let sum = 0;
                const data = event.renderedBuffer.getChannelData(0);
                for (let i = 4500; i < 5000; i++) {
                    sum += Math.abs(data[i]);
                }
                compressor.disconnect();
                resolve(sum.toString());
            };

            context.startRendering();
        } catch (error) {
            reject(error);
        }
    });
};
