# Security Policy

## Supported versions

Candidait is in initial development. There are no supported releases or production environments. Security work currently targets the latest code on `main` only.

| Version | Supported |
| --- | --- |
| Latest `main` | Development only |
| Older commits or branches | No |

## Reporting a vulnerability

Do not disclose a suspected vulnerability in a public issue, discussion, or pull request.

Candidait is a public repository maintained by `sjtechrec`. To report a suspected vulnerability privately, use [Report a vulnerability](https://github.com/sjtechrec/candidait/security/advisories/new) in the repository Security tab. GitHub private vulnerability reporting is enabled; reports are shared privately with the maintainer.

For a vulnerability discovered by the maintainer, create a draft repository security advisory. Keep exploit details out of public issues, pull requests, and commit messages, and coordinate disclosure through the private advisory.

A useful report includes:

- A clear description of the vulnerability and its potential impact.
- Reproduction steps or a proof of concept.
- Affected files, versions, or environments.
- Any suggested mitigation, if known.

Do not access, modify, or retain data that does not belong to you while researching a vulnerability.

## Before production

Before Candidait handles real user or candidate data, the project must document data classification, retention and deletion, authorization boundaries, audit logging, secret management, incident response, third-party data processing, and recovery procedures.
