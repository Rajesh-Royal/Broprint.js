# Changelog
All notable changes to this project will be documented in this file.

## [2.2.0] - 2025-08-11

### Added

- Multi-format build: ESM (`index.mjs`), CJS (`index.js`), and global/IIFE (`index.global.js`).
- Export map for proper Node/ bundler resolution.
- Automatic global `getCurrentBrowserFingerPrint` exposure for classic `<script>` usage.

### Fixed

- CDN usage now works for both `<script type=module>` and classic `<script>` tags.

### Docs

- README updated with new CDN examples and removed outdated crypto-js reference.

## [2.1.0] - 2022-05-18
### Added
- Logical conditions added for brave browser
- Readme file and license updated
- driver function renamed

## [2.0] - 2022-04-22
### Added
- Crypto-js dependency removed
- encryption and hashing algorithms updated.
- brave browser gives unique id also.

## [1.2.0] - 2022-04-22
### Added
- Package renamed as broprint.js

## [1.1.2] - 2022-04-19
### Added
- Deployed to netlify.
- Better documentation added.

## [1.1.1] - 2022-04-06
### Added
- Ts types updated.
- Readme updated for better documentation and with sandbox example

## [1.1.0] - 2022-04-05
### Added
- Typescript support
- crypto-js encryption

## [1.0.1] - 2022-03-03
### Added
- demo added

## [1.0.0] - 2022-03-03
### Initialized
- Version upgrade.
- New types added
