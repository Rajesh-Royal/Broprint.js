# AI Assistant Working Instructions for Broprint.js

These instructions teach AI coding agents how to contribute effectively to this repository. Keep answers concise and pragmatic.

## Project Essence
- Purpose: Generate a stable (not guaranteed globally unique) browser fingerprint combining an AudioContext timing trace + a rendered Canvas data URI hashed with `cyrb53` (custom 53‑bit hash).
- Public API surface (exported): `getCurrentBrowserFingerPrint(): Promise<string>` from `src/index.ts`.
- Build: TypeScript -> JS via `npm run build:npm` (tsc). Published package exposes compiled code in `lib/` with `main` + `types` pointing to `./lib/index.*`.

## Key Files / Flow
1. `src/index.ts` orchestrates fingerprint creation:
   - Calls `generateTheAudioFingerPrint.run(cb)` (offline audio render) -> partial numeric string.
   - Calls `getCanvasFingerprint()` -> data URI of deterministic canvas drawing (or static fallback if unsupported).
   - Concatenates (currently same logic for Brave) then base64 encodes audio part and appends canvas value, then hashes with `cyrb53` (seed 0) -> final number, coerced to string.
2. `src/code/generateTheAudioPrints.ts`: Offline AudioContext rendering 500 frames (indices 4500-4999) summed to produce a floating sum -> stringed.
3. `src/code/GenerateCanvasFingerprint.ts`: Draws layered text & shapes on canvas for entropy; returns `canvas.toDataURL()`.
4. `src/code/EncryptDecrypt.ts`: Contains hash utilities used (murmurhash3_32_gc, javaHashCode, cyrb53). Only `cyrb53` currently used by public API.

## Conventions & Patterns
- No external runtime dependencies (despite README mention of crypto-js in older versions). Keep bundle tiny; avoid adding deps unless essential.
- Hash / fingerprint logic purposely simple & deterministic; avoid introducing time, locale, or network variability unless behind an opt-in flag.
- Use synchronous operations except for audio (asynchronous OfflineAudioContext). Promise composition kept minimal.
- Fallback behavior: If audio fingerprinting fails, fall back to canvas-only hash inside catch.
- Brave browser branch present but currently identical; if modifying, keep Brave privacy differences in mind (possible reduced entropy).
- No test suite yet; if adding tests, prefer lightweight Jest or vitest with jsdom for canvas + mock Web Audio.
- Formatting is minimal; preserve existing style (no semicolons at ends except retained by file, loose var usage inside legacy code—refactors should be incremental, not sweeping).

## Build / Publish Workflow
- Build command: `npm run build:npm` (invokes `tsc`). Ensure `lib/` artifacts updated.
- CI: `.github/workflows/ci.yml` builds on PRs (develop/master) and pushes to develop.
- Publish: Push to `master` triggers `.github/workflows/publish.yml` which publishes if the version in `package.json` is not already on npm. Version bumps are manual.
- Files published: restricted via `package.json#files` (lib, LICENSE, README.MD). Ensure any new public types land in `lib/`.

## When Editing Public API
- Update both TypeScript source (`src/`) and ensure build outputs land in `lib/` (run build locally before committing if repo tracks build output; if not, rely on publish workflow to regenerate—currently repository already contains `lib/`).
- Keep signature of `getCurrentBrowserFingerPrint` stable; if adding options, prefer an optional parameter object with defaults (e.g., `{ includeAudio?: boolean; includeCanvas?: boolean; seed?: number }`).
- Document new options in README and bump minor version.

## Error Handling
- Current API rejects only on total failure (both audio + canvas). Preserve this contract; do not throw synchronous errors—return a rejected Promise.
- If adding new failure modes, ensure they’re caught and degrade gracefully to reduced-entropy fingerprint.

## Performance / Size Considerations
- Avoid heavy libs (crypto, uuid) — custom hashing already present.
- Audio & canvas operations should remain < a few ms; do not add layout thrash or large DOM manipulations.

## Example Usage (keep working)
```ts
import { getCurrentBrowserFingerPrint } from '@rajesh896/broprint.js';
const id = await getCurrentBrowserFingerPrint();
```

## Common Pitfalls for Agents
- Don’t introduce Node-only APIs into browser path (fs, path, etc.). This library is browser-focused.
- Avoid using Date.now randomness in the fingerprint (breaks determinism) unless put behind a clearly documented opt-in.
- Maintain ESM compatibility; entry point currently works via bare import.
- Preserve tree-shake friendliness: avoid side-effectful top-level code.

## Safe Extension Ideas (If Asked)
- Optional config parameter to disable audio or canvas.
- Expose raw (unhashed) components for analytics (`getRawFingerPrintParts()` returning { audio, canvas }).
- Add lightweight tests for deterministic hashing given mocked inputs.

## Security / Privacy Notes
- Fingerprint NOT cryptographically secure or collision-proof; it’s a heuristic identifier. Be explicit if asked.
- Respect user privacy—avoid adding invasive signals (plugins, fonts) without discussion.

## Maintainer Metadata
- CODEOWNERS: @Rajesh-Royal owns all paths.
- Direct questions to issues or discussions; security concerns follow SECURITY.md process.

Respond with changes only; keep explanations short.
