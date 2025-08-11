# Security Policy

## Supported Versions

We generally support (accept vulnerability reports against) the latest published minor version on npm. Older versions may be fixed selectively if the patch is low risk.

| Version | Supported |
| ------- | --------- |
| latest  | ✅        |
| < latest | ⚠️ security issues may not be patched |

## Reporting a Vulnerability

If you discover a security vulnerability:

1. DO NOT open a public issue.
2. Email: `security@placeholder.invalid` (replace with a real contact) OR use GitHub private vulnerability reporting if enabled.
3. Provide a minimal reproduction, impact assessment, and proposed disclosure timeline.

We'll acknowledge receipt within 72 hours and aim to provide an initial remediation plan within 7 days.

## Handling & Disclosure Process

1. Triage & reproduce.
2. Assess severity (CVSS-like scoring internal).
3. Develop & test fix.
4. Release a patched version to npm.
5. Publicly disclose via release notes / changelog after users have reasonable upgrade window.

## Best Practices for Users

- Always pin to a specific version range and upgrade promptly when patches release.
- Avoid exposing internal fingerprint outputs directly to clients beyond needed scope.
- Sanitize and validate any data you persist.

## Scope

This policy covers code in this repository published as the `@rajesh896/broprint.js` package.

## Out of Scope

- Social engineering attacks.
- Issues requiring privileged local access.
- Vulnerabilities in third-party dependencies unless we can reasonably patch or mitigate.

Thank you for helping keep the community safe.
