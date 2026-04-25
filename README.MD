<h1 align="center">Broprint.js</h1>
<p align="center">The world's easiest, smallest and powerful visitor identifier for browsers.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@rajesh896/broprint.js">
    <img src="https://img.shields.io/npm/v/@rajesh896/broprint.js" alt="npm version">
  </a>
  <a href="https://github.com/Rajesh-Royal/Broprint.js/actions/workflows/ci.yml">
    <img src="https://github.com/Rajesh-Royal/Broprint.js/actions/workflows/ci.yml/badge.svg?branch=develop" alt="CI status">
  </a>
  <a href="https://codecov.io/gh/Rajesh-Royal/Broprint.js">
    <img src="https://codecov.io/gh/Rajesh-Royal/Broprint.js/branch/develop/graph/badge.svg" alt="Coverage">
  </a>
  <a href="https://bundlephobia.com/package/@rajesh896/broprint.js">
    <img src="https://img.shields.io/bundlephobia/minzip/@rajesh896/broprint.js" alt="Minzipped size">
  </a>
  <a href="https://github.com/Rajesh-Royal/Broprint.js/blob/develop/LICENSE">
    <img src="https://img.shields.io/npm/l/@rajesh896/broprint.js" alt="License">
  </a>
  <a href="https://x.com/intent/tweet?text=The world's easiest, smallest and powerful visitor identifier for browsers.&url=https://github.com/Rajesh-Royal/Broprint.js&hashtags=javascript,opensource,js,webdev,developers"><img src="http://randojs.com/images/tweetShield.svg" alt="Tweet" height="20"/></a>
</p>

<p align="center">
  Generate a stable per-browser identifier from <strong>canvas</strong> + <strong>audio</strong> fingerprints, hashed with a fast, zero-dependency 53-bit hash. No tracking pixels, no third-party services, no runtime dependencies.
</p>

<p align="center"><a href="https://github.com/Rajesh-Royal/Broprint.js"><img src="https://user-images.githubusercontent.com/24524924/163906729-f34e193a-e202-43ae-ba4b-c460da6cc911.gif" width="100%"/></a></p>

<p align="center"><a href="https://codesandbox.io/s/browser-fingerprinting-generate-unique-device-id-or-browser-id-507n2v" target="_blank">CodeSandbox</a> · <a href="https://broprintjs.netlify.app/" target="_blank">Live Demo</a></p>

> ⚠️ **Not a security primitive.** The hash (`cyrb53`) is a fast, non-cryptographic checksum. Use it for visitor identification, analytics, and fraud-signal heuristics — not for authentication, password storage, or anything that requires collision resistance.

> 📦 **Migrating from v2?** See [`MIGRATION.md`](./MIGRATION.md) for the breaking changes in v3.0.0.

---

## Install

```sh
npm i @rajesh896/broprint.js
# or
yarn add @rajesh896/broprint.js
# or
pnpm add @rajesh896/broprint.js
```

### CDN (no install)

ESM (modern browsers):

```html
<script type="module">
    import { getCurrentBrowserFingerPrint } from 'https://cdn.jsdelivr.net/npm/@rajesh896/broprint.js@latest/lib/index.mjs';
    getCurrentBrowserFingerPrint().then((fp) => console.log('Fingerprint:', fp));
</script>
```

Classic global build (no module support needed):

```html
<script src="https://cdn.jsdelivr.net/npm/@rajesh896/broprint.js@latest/lib/index.global.js"></script>
<script>
    Broprint.getCurrentBrowserFingerPrint().then((fp) => console.log('Fingerprint:', fp));
</script>
```

## Quick start

```js
import { getCurrentBrowserFingerPrint } from '@rajesh896/broprint.js';

const fingerprint = await getCurrentBrowserFingerPrint();
// → "1234567890123456" — a stable numeric string for this browser
```

### Disable a signal

```js
// canvas-only (skip audio entirely)
await getCurrentBrowserFingerPrint({ useAudio: false });

// audio-only
await getCurrentBrowserFingerPrint({ useCanvas: false });

// custom seed (e.g. to namespace fingerprints per-app)
await getCurrentBrowserFingerPrint({ seed: 42 });
```

### Use the building blocks directly

The individual signal generators and the hash function are also exported, so you can compose your own pipeline:

```js
import {
    getCanvasFingerprint,
    getAudioFingerprint,
    cyrb53,
    isCanvasSupported
} from '@rajesh896/broprint.js';

const canvas = getCanvasFingerprint(); // sync, returns canvas dataURL
const audio = await getAudioFingerprint(); // async, returns numeric string
const hash = cyrb53(canvas + audio); // → number in [0, 2^53)
```

## API

### `getCurrentBrowserFingerPrint(options?)`

| Option       | Type      | Default | Description                                                                  |
| ------------ | --------- | ------- | ---------------------------------------------------------------------------- |
| `useAudio`   | `boolean` | `true`  | Include the audio fingerprint signal.                                        |
| `useCanvas`  | `boolean` | `true`  | Include the canvas fingerprint signal.                                       |
| `seed`       | `number`  | `0`     | Custom seed for the cyrb53 hash. Use to namespace fingerprints per-app.      |

**Returns:** `Promise<string>` — a stable numeric string (53-bit hash, base-10).

**Throws:**

- If both `useAudio` and `useCanvas` are `false` (no signals selected).
- If the only enabled signal fails (e.g. `useCanvas: false` on a browser that blocks `OfflineAudioContext`).
- If audio fails **and** canvas also fails.

If audio is enabled but fails (e.g. privacy mode blocks `OfflineAudioContext`) and canvas is also enabled, the function automatically falls back to a canvas-only fingerprint.

### Named exports

- `getCanvasFingerprint(): string` — render the canvas + return its `toDataURL()`.
- `isCanvasSupported(): boolean` — feature-detects HTML5 canvas with a 2D context.
- `getAudioFingerprint(): Promise<string>` — render an OfflineAudioContext graph + return the float sum as a string.
- `cyrb53(str: string, seed?: number): number` — fast, non-cryptographic 53-bit hash.
- `BroprintOptions` — TypeScript type for the options object.

## How it works

```
                    ┌────────────────────────────────┐
                    │         getAudioFingerprint    │
  Audio entropy ──▶ │  OfflineAudioContext renders   │ ──▶ float sum (string)
                    │  500 frames through a          │
                    │  DynamicsCompressor.           │
                    └────────────────────────────────┘
                                     │
                                     ▼  base64-encode
                    ┌────────────────────────────────┐
                    │       getCanvasFingerprint     │
  Canvas entropy ──▶│  Draw layered text + shapes    │ ──▶ canvas.toDataURL()
                    │  and read back the data URI    │
                    │  (varies by GPU / font stack). │
                    └────────────────────────────────┘
                                     │
                                     ▼  concat
                    ┌────────────────────────────────┐
                    │              cyrb53            │ ──▶ 53-bit numeric hash
                    │  (custom, no deps, ~10 lines)  │     coerced to string
                    └────────────────────────────────┘
                                     │
                                     ▼
                              fingerprint
```

## Browser compatibility

| API                     | Required for                | Support                                                  |
| ----------------------- | --------------------------- | -------------------------------------------------------- |
| `HTMLCanvasElement`     | canvas signal               | All modern browsers                                      |
| `OfflineAudioContext`   | audio signal                | All modern browsers (`webkitOfflineAudioContext` fallback for older Safari) |
| `Promise` / `async`     | always                      | All modern browsers (ES2017+)                            |

Tested on the latest stable Chrome, Firefox, Safari, and Edge. Node ≥ 18 is required for the build/test toolchain.

## Caveats

- **Not unique forever.** A browser update, GPU driver change, OS upgrade, or "ungoogled" build can change the output. Treat the fingerprint as a stable signal *for a session/install*, not a permanent identity.
- **Privacy modes can block signals.** Some privacy-focused browsers (Brave Strict, Tor, Firefox RFP) randomize or block the underlying APIs. The library falls back gracefully to the available signal, but the output will differ from the same user's "normal" browsing.
- **Not for security.** The 53-bit `cyrb53` hash is fast and well-distributed but not cryptographically secure — collisions exist and the algorithm is reversible with effort. Don't use the output as a session token or password salt.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the dev setup, test/lint loop, and PR process. Bug reports and feature requests are welcome via GitHub Issues; security-sensitive reports should follow [`SECURITY.md`](./SECURITY.md).

## License

[MIT](./LICENSE) © Rajesh Royal

---

[![Stargazers repo roster for @Rajesh-Royal/Broprint.js](https://reporoster.com/stars/Rajesh-Royal/Broprint.js)](https://github.com/Rajesh-Royal/Broprint.js/stargazers)
[![Forkers repo roster for @Rajesh-Royal/Broprint.js](https://reporoster.com/forks/Rajesh-Royal/Broprint.js)](https://github.com/Rajesh-Royal/Broprint.js/network/members)

<p align="center"><a href="#broprintjs"><img src="http://randojs.com/images/backToTopButtonTransparentBackground.png" alt="Back to top" height="29"/></a></p>
