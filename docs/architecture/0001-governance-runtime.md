# ADR 0001: Use Node.js for initial governance checks

- Status: Accepted, provisional
- Date: 2026-10-02

## Context

Candidait does not yet have an application stack. Repository policy still needs locally testable, cross-platform checks. The primary development environment is Windows, so Bash-only guards would add an undocumented Git Bash or WSL dependency.

## Decision

Use pinned Node.js 24 and its standard library for the initial repository-policy scripts. Do not add runtime dependencies or a package manager solely for these checks. GitHub Actions and local development run the same scripts directly with `node`.

## Consequences

- Policy checks work on Windows, macOS, Linux, and GitHub-hosted runners.
- The repository temporarily carries a Node.js governance dependency before choosing the application stack.
- The decision must be revisited when the application runtime is selected. If the application uses another suitable cross-platform runtime, migrate the guards or record why Node remains.
- Application lint, test, typecheck, and build jobs remain absent until real commands exist.
