# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.0.0] - 2026-04-26

### Breaking

- Audio fingerprint output no longer prefixed with the literal string `"null"` ([#23]). The accumulator was initialized to `null` and used `+=`, so every v2 audio fingerprint started with `"null"` before the actual sum. Final fingerprints will differ from v2 — see [`MIGRATION.md`](./MIGRATION.md).
- Audio fingerprint module rewritten with per-call state to fix a concurrency bug ([#22]). Two overlapping calls in v2 raced on shared module-scoped mutables; v3 calls are independent.
- `package.json` `bin` field removed ([#21]) — pointed at a nonexistent script.
- `@ts-nocheck` directives removed from `EncryptDecrypt.ts` and the audio module ([#24]). The internal `cyrb53` return type is now `number` (was lied about as `string` via `as unknown as string`).
- Dead code removed ([#25]): `src/webRTC.js`, `src/code/FingerPrint.ts`, `murmurhash3_32_gc`, and `javaHashCode` deleted from the source tree.
- `index.ts` rewritten with `async`/`await` ([#26]); the unused Brave-specific code path was removed.

### Added

- New `options` parameter for `getCurrentBrowserFingerPrint` ([#27]):
    - `useAudio` (default `true`) — include the audio signal.
    - `useCanvas` (default `true`) — include the canvas signal.
    - `seed` (default `0`) — custom seed for cyrb53 (namespace fingerprints per app).
    - Throws when both signals are disabled.
- New named exports for the building blocks ([#28]):
    - `getCanvasFingerprint`, `isCanvasSupported`, `getAudioFingerprint`, `cyrb53`, and the `BroprintOptions` type.
- Vitest test suite ([#32]) with 36 tests across cyrb53, canvas, audio, and integration.
- Canvas fingerprint unit tests ([#33]).
- Audio fingerprint unit tests with concurrency + null-prefix regression guards ([#34]).
- Integration tests for `getCurrentBrowserFingerPrint` covering every option combination + fallback paths ([#35]).
- `size-limit` budget of 2 KB brotli per format (esm, cjs, iife), enforced in CI ([#37]).
- Codecov coverage reporting on PRs with an 80% target ([#38]).
- v2 → v3 migration guide ([`MIGRATION.md`](./MIGRATION.md)) ([#40]).
- Husky pre-commit hooks + lint-staged + `CONTRIBUTING.md` ([#30]).
- ESLint + Prettier + EditorConfig ([#29]).

### Changed

- Package metadata: `"sideEffects": false` for tree-shaking, `engines.node: ">=18"`, `prepublishOnly` script, keyword cleanup ([#31]).
- README rewritten ([#39]): factual fixes (no more "cryptographically strong" claim or `crypto-js` reference), new API reference, browser compatibility table, dynamic badges.
- CI matrix expanded to Node 18, 20, 22 with type-check + format-check gates ([#36]).

[#21]: https://github.com/Rajesh-Royal/Broprint.js/issues/21
[#22]: https://github.com/Rajesh-Royal/Broprint.js/issues/22
[#23]: https://github.com/Rajesh-Royal/Broprint.js/issues/23
[#24]: https://github.com/Rajesh-Royal/Broprint.js/issues/24
[#25]: https://github.com/Rajesh-Royal/Broprint.js/issues/25
[#26]: https://github.com/Rajesh-Royal/Broprint.js/issues/26
[#27]: https://github.com/Rajesh-Royal/Broprint.js/issues/27
[#28]: https://github.com/Rajesh-Royal/Broprint.js/issues/28
[#29]: https://github.com/Rajesh-Royal/Broprint.js/issues/29
[#30]: https://github.com/Rajesh-Royal/Broprint.js/issues/30
[#31]: https://github.com/Rajesh-Royal/Broprint.js/issues/31
[#32]: https://github.com/Rajesh-Royal/Broprint.js/issues/32
[#33]: https://github.com/Rajesh-Royal/Broprint.js/issues/33
[#34]: https://github.com/Rajesh-Royal/Broprint.js/issues/34
[#35]: https://github.com/Rajesh-Royal/Broprint.js/issues/35
[#36]: https://github.com/Rajesh-Royal/Broprint.js/issues/36
[#37]: https://github.com/Rajesh-Royal/Broprint.js/issues/37
[#38]: https://github.com/Rajesh-Royal/Broprint.js/issues/38
[#39]: https://github.com/Rajesh-Royal/Broprint.js/issues/39
[#40]: https://github.com/Rajesh-Royal/Broprint.js/issues/40

## [2.2.1] - 2025-08-12

### Changed

- Updated Twitter/X profile URL in `package.json` author/homepage metadata.

## [2.2.0] - 2025-08-11

### Added

- Multi-format build: ESM (`index.mjs`), CJS (`index.js`), and global/IIFE (`index.global.js`).
- Export map for proper Node/bundler resolution.
- Automatic global `getCurrentBrowserFingerPrint` exposure for classic `<script>` usage.

### Fixed

- CDN usage now works for both `<script type=module>` and classic `<script>` tags.

### Docs

- README updated with new CDN examples and removed outdated crypto-js reference.

## [2.1.0] - 2022-05-18

### Added

- Logical conditions added for Brave browser.
- README and license updated.
- Driver function renamed.

## [2.0.0] - 2022-04-22

### Added

- crypto-js dependency removed.
- Encryption and hashing algorithms updated.
- Brave browser now produces a unique ID.

## [1.2.0] - 2022-04-22

### Added

- Package renamed to broprint.js.

## [1.1.2] - 2022-04-19

### Added

- Deployed to Netlify.
- Better documentation added.

## [1.1.1] - 2022-04-06

### Added

- TypeScript types updated.
- README updated for better documentation, with sandbox example.

## [1.1.0] - 2022-04-05

### Added

- TypeScript support.
- crypto-js encryption.

## [1.0.1] - 2022-03-03

### Added

- Demo added.

## [1.0.0] - 2022-03-03

### Initialized

- Version upgrade.
- New types added.

[Unreleased]: https://github.com/Rajesh-Royal/Broprint.js/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/Rajesh-Royal/Broprint.js/compare/v2.2.1...v3.0.0
[2.2.1]: https://github.com/Rajesh-Royal/Broprint.js/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/Rajesh-Royal/Broprint.js/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/Rajesh-Royal/Broprint.js/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/Rajesh-Royal/Broprint.js/compare/v1.2.0...v2.0.0
[1.2.0]: https://github.com/Rajesh-Royal/Broprint.js/compare/v1.1.2...v1.2.0
[1.1.2]: https://github.com/Rajesh-Royal/Broprint.js/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/Rajesh-Royal/Broprint.js/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/Rajesh-Royal/Broprint.js/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/Rajesh-Royal/Broprint.js/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/Rajesh-Royal/Broprint.js/releases/tag/v1.0.0
