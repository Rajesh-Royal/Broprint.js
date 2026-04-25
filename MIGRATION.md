# Migration Guide

## v2.x → v3.0.0

> **TL;DR:** v3 fingerprints are **different** from v2 fingerprints for the same browser. The change is intentional (two underlying bugs were fixed) and the new outputs are stable. If you only use fingerprints for the current session, no action is needed. If you **store** fingerprints and match them later, read the [Stored fingerprints](#stored-fingerprints) section.

### Why fingerprints changed

Two bugs in the v2 audio pipeline made every output unintentionally different from what the implementation claimed to produce. v3 fixes both — which means a v3 fingerprint for a given browser will not match the v2 fingerprint for the same browser.

#### 1. Audio output was prefixed with the literal string `"null"` ([#23](https://github.com/Rajesh-Royal/Broprint.js/issues/23))

The audio reducer initialized its accumulator to `null` and used `+=`. JavaScript coerced the first concatenation to `"null" + 0.0001…`, so every audio fingerprint started with the literal four characters `"null"` before the actual sum.

```js
// v2 audio output
'null0.05000000000000004';

// v3 audio output (the bug fix)
'0.05000000000000004';
```

That changes the input to the cyrb53 hash, which changes the final fingerprint.

#### 2. Audio module had a concurrency bug ([#22](https://github.com/Rajesh-Royal/Broprint.js/issues/22))

The audio module used module-scoped mutables for state — two overlapping calls would race on the same buffer. v3 scopes all state inside `getAudioFingerprint()`, so concurrent calls now resolve independently. This doesn't usually change the value for a single sequential call, but it removes a class of nondeterminism that was producing slightly different outputs in apps that called the function in parallel.

### Other breaking changes

| Area                             | v2 behavior                                                                          | v3 behavior                      |
| -------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------- |
| Default audio output             | Prefixed with `"null"`                                                               | Numeric string only              |
| Concurrency                      | Shared module state                                                                  | Per-call state                   |
| `package.json` `bin` field       | Pointed at nonexistent script                                                        | Removed                          |
| Dead code                        | `webRTC.js`, `FingerPrint.ts`, `murmurhash3_32_gc`, `javaHashCode` shipped in source | Removed (not in any export path) |
| `@ts-nocheck` directives         | Present on hash + audio modules                                                      | Removed; modules fully typed     |
| Return type of internal `cyrb53` | Documented as `string`, returned `number`                                            | Documented and returns `number`  |

### Stored fingerprints

If you persist fingerprints in a database for visitor identification, every stored v2 fingerprint will fail to match the v3 fingerprint for the same browser. Pick a strategy:

#### Strategy A — Dual-period match (lowest user friction)

Vendor both versions for a transition window and match against either.

```js
// install both: the v3 version (current) and a pinned v2 copy
import { getCurrentBrowserFingerPrint as v3 } from '@rajesh896/broprint.js';
import { getCurrentBrowserFingerPrint as v2 } from '@rajesh896/broprint.js@2.2.1';

const [fpV2, fpV3] = await Promise.all([v2(), v3()]);
const known = await db.findOne({ $or: [{ fingerprint: fpV2 }, { fingerprint: fpV3 }] });
if (known) {
    // recognized — opportunistically upgrade the stored value to v3
    await db.update(known.id, { fingerprint: fpV3, fingerprint_version: 3 });
} else {
    // new visitor — store the v3 value
    await db.insert({ fingerprint: fpV3, fingerprint_version: 3 });
}
```

After a few weeks of overlap, the v2 vendoring can be removed.

#### Strategy B — Re-fingerprint at next visit

If your fingerprints already age out (e.g. tied to short-lived analytics sessions), just deploy v3 and let the old values expire naturally. New sessions get v3 fingerprints; old ones drop off.

#### Strategy C — Version-tag and namespace

Store the fingerprint version alongside the value:

```js
{ fingerprint: '1234567890123456', version: 3 }
```

Match only against the same version. Older values become unmatchable but don't cause false negatives against new ones.

### API additions (non-breaking)

These are additive — existing v2 call sites keep working.

#### Optional `options` parameter

```js
// v2 — still works in v3
const fp = await getCurrentBrowserFingerPrint();

// v3 — new
const fp = await getCurrentBrowserFingerPrint({
    useAudio: true, // default true
    useCanvas: true, // default true
    seed: 0 // default 0 — namespace fingerprints per app
});
```

See the README for the full options table.

#### New named exports

The individual building blocks are now exported, so you can compose your own pipeline:

```js
import {
    getCanvasFingerprint,
    getAudioFingerprint,
    cyrb53,
    isCanvasSupported
} from '@rajesh896/broprint.js';
```

Combined with `"sideEffects": false` in `package.json`, ESM bundlers can tree-shake the parts you don't use.

#### Full TypeScript types

The public API is now fully typed (the `@ts-nocheck` directives in v2 hid type errors from consumers). Type information ships in `lib/index.d.ts`. The `BroprintOptions` interface is exported.

### Upgrade checklist

- [ ] Read the [Stored fingerprints](#stored-fingerprints) section and pick a strategy if you persist fingerprints.
- [ ] Update your dependency: `npm install @rajesh896/broprint.js@^3`.
- [ ] If you import from a non-default path (rare), check that you're using the new exports.
- [ ] If you have TypeScript and were silently relying on the v2 `as unknown as string` lie, the return type is now `Promise<string>` (correct) — usage sites typed against `string` will keep working.
- [ ] Consider switching to the named exports + tree-shaking if you only need one signal.
