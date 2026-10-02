# Security Policy

## Supported versions

Candidait is in initial development. There are no supported releases or production environments. Security work currently targets the latest code on `main` only.

| Version | Supported |
| --- | --- |
| Latest `main` | Development only |
| Older commits or branches | No |

## Reporting a vulnerability

Do not disclose a suspected vulnerability in a public issue, discussion, or pull request.

This private repository currently has one maintainer and no external reporting channel. Do not grant broader access or begin external testing until a dedicated security contact is configured.

For a vulnerability discovered by the maintainer, create a draft repository security advisory and keep exploit details out of normal issues, pull requests, and commit messages. Future authorized collaborators must use the private security contact documented here once it exists.

A useful report includes:

- A clear description of the vulnerability and its potential impact.
- Reproduction steps or a proof of concept.
- Affected files, versions, or environments.
- Any suggested mitigation, if known.

Do not access, modify, or retain data that does not belong to you while researching a vulnerability.

## Before production

Before Candidait handles real user or candidate data, the project must document data classification, retention and deletion, authorization boundaries, audit logging, secret management, incident response, third-party data processing, and recovery procedures.
