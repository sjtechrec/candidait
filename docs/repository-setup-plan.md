# Repository setup plan

## Purpose

This plan establishes a small, verifiable path from an empty private repository to a repository capable of supporting production work. Controls are added only when they can be demonstrated. Missing capabilities remain explicit blockers rather than silently passing stubs.

The plan is tailored to the repository state observed on 2026-10-02:

- Private repository owned by the personal account `sjtechrec`.
- One collaborator, who is the repository administrator.
- No application code, production environment, or supported release.
- GitHub Actions enabled with read-only default workflow permissions.
- All merge methods initially enabled and merged branches retained.
- At the baseline, no required checks, protected branch, ruleset, environment, or Project.
- GitHub rejected private-repository rulesets with an instruction to upgrade to GitHub Pro or make the repository public.

## Operating principles

1. One pull-request path to `main`, technically enforced when the GitHub plan supports it.
2. Desired repository settings are reviewable, but privileged automation is introduced only after a read-only checker proves useful.
3. One stable required check named `verify`; every real gate feeds it.
4. Independent CI work runs in parallel and every job has a timeout.
5. Every guard has tests proving both failure and success.
6. Missing configuration fails loudly only after that capability is declared; nonexistent application checks are not represented by no-op scripts.
7. Squash merges create a linear history whose subjects follow the pull request convention.
8. Merged, deployed, and working are separate states; deployments eventually report and verify the live commit.
9. Prefer GitHub-native links, rules, and Project workflows over inference from prose.
10. Keep documentation indexed and small: decisions are ADRs, work is Issues, and status is the Project.

## Current operating mode

### Advisory mode

Until the private repository has GitHub Pro or becomes public, CI and the PR process are advisory. Direct pushes and noncompliant merges remain technically possible. Documentation must not claim otherwise.

### Enforced mode

Enforced mode begins only after a canary proves that GitHub blocks a red pull request and a direct update to `main`. It requires a supported plan, an active ruleset, a recently successful `verify` check, and a tested break-glass procedure.

## Owner decisions

The following decisions block later phases:

1. Product purpose, users, and first measurable outcome.
2. Proprietary versus open-source distribution. The current all-rights-reserved notice is conservative and reversible.
3. GitHub Pro versus public visibility versus continued advisory mode.
4. Application language, runtime, package manager, database, and deployment target.
5. The private security-reporting channel.
6. The data handled by Candidait, including whether candidate, resume, interview, ranking, or employment-decision data is involved.

## Phase 1: repository foundation

Deliverables:

- Root README, contribution guide, code of conduct, security policy, roadmap, temporary bootstrap list, changelog placeholder, ignore rules, and license notice.
- `.editorconfig` and `.gitattributes` for deterministic cross-platform text handling.
- Pull request template under `.github/`.
- Structured bug and feature issue forms with blank issues disabled.
- Informational CODEOWNERS file.
- Documentation index, this plan, and pull request conventions.

Acceptance:

- Documentation contains no false claims about protection, support, releases, or deployment.
- Licensing matches the current owner decision.
- Links and structured files validate.
- The pull request title and body comply with the documented convention.

## Phase 2: minimal governance CI

Implement only real, dependency-light policy checks. Prefer the application runtime after it is selected; a temporary cross-platform Node script is acceptable only if its role and version are explicit.

The first workflow must:

- Trigger on pull requests, pushes to `main`, merge groups, and manual dispatch.
- Use read-only permissions by default.
- Pass event data through environment variables rather than interpolating untrusted content into shell programs.
- Run policy tests and repository validation.
- Validate the PR title and body for pull-request events.
- Finish with `verify` using `if: always()` and explicit dependency-result checks.
- Avoid workflow-level path filters and CI-skip mechanisms.
- Use full commit SHAs for external actions and record the intended tag beside each pin.

The title checker enforces structure, allowed type and scope, breaking syntax, length, and punctuation. Imperative English remains a reviewer judgment.

Canary sequence:

1. Run the workflow successfully without requiring it.
2. Break each guard fixture and confirm the guard self-test detects the mutation.
3. Make a canary PR fail and verify that `verify` fails.
4. Restore the change and verify that `verify` succeeds.
5. Record the check name and GitHub App source.

No lint, typecheck, test, or build job exists until the application has a real command for it.

## Phase 3: safe repository settings

After Phase 2 is green:

- Allow squash merging only.
- Use the PR title as the default squash subject.
- Delete merged branches automatically.
- Keep automatic merge disabled until branch rules exist.
- Keep the default workflow token read-only and prevent Actions from approving PRs.
- Require full-SHA action pins after every existing action is pinned.
- Restrict allowed Actions only after the allowlist has been tested.

Commit desired-state JSON and a read-only settings report before building an apply tool. The first settings application is manual and reviewed. Any future apply command is dry-run by default, requires `--apply`, validates schemas, snapshots before and after state, reports partial failure, and documents rollback. It must not run in CI with a personal token.

## Phase 4: protected `main`

Prerequisites:

- GitHub plan or visibility supports rulesets.
- `verify` completed successfully in the repository recently.
- Ruleset is tested disabled or in evaluation mode where available.

Initial rules:

- Pull request required.
- `verify` required from the GitHub Actions app.
- Conversation resolution required.
- Linear history required.
- Force pushes and deletion blocked.
- Final commit subject restricted to the accepted Conventional Commit pattern.
- Zero approvals while only one maintainer exists.
- Code-owner approval disabled while only one maintainer exists.
- No routine bypass actor.

After a second trusted maintainer is added:

- Require one approval.
- Require code-owner review for `.github/`, policy guards, settings, authentication, authorization, migrations, production deployment, and CODEOWNERS itself.
- Dismiss stale approvals or require approval of the most recent push.

Activation test:

- Confirm a red PR cannot merge.
- Confirm a compliant green PR can merge.
- Confirm a direct push to `main` is rejected.
- Confirm a noncompliant squash subject is rejected.
- Exercise and document break-glass recovery.

## Phase 5: minimal GitHub Project

Status: completed on 2026-10-02. The live configuration and working agreement are documented in [github-project.md](github-project.md).

Start with one Candidait Project and avoid duplicate classification.

Fields:

- Status: Backlog, Ready, In progress, Blocked, Done.
- Priority: P0, P1, P2, P3.
- Size: XS, S, M, L.

Automation:

- One native auto-add workflow for this repository.
- New items enter Backlog.
- Closed issues and merged PRs move to Done.

Labels represent issue kind or exceptional state, not Project fields. Keep `bug`, `enhancement`, `documentation`, and `accessibility`; add `security`, `dependencies`, and `blocked` when needed. Add Area and release fields only when real work volume justifies them.

Migrate `TODO.md` into Issues, then replace it with a link to the Project or remove it.

## Phase 6: application foundation

Land the selected runtime, exact package-manager version, committed lockfile, reproducible setup, safe `.env.example`, and real application checks together.

Add applicable parallel jobs:

- Format or lint.
- Typecheck.
- Unit and integration tests.
- Build.
- Secret scan with a pinned, checksum-verified tool.

Every job feeds `verify`. Local hooks remain fast conveniences and never replace CI. If Node is not the application runtime, do not retain Node and pnpm solely out of template inertia without an ADR.

Because the current checkout is in OneDrive, monitor dependency installation, sync conflicts, and file locking. Move the working copy to a nonsynchronized development directory if these appear; GitHub remains the source backup.

## Phase 7: product and data safety

Before using real candidate or user data, create reviewed requirements for:

- Data classification and minimization.
- Retention, deletion, export, and backups.
- Authentication, authorization, and production access.
- Audit events and incident response.
- Secret management and encryption.
- Third-party and model-provider data handling.
- Evaluation for harmful or biased outcomes where the product influences consequential decisions.
- Human review, correction, and appeal paths where appropriate.

These are production gates, not optional roadmap prose.

## Phase 8: dependencies and releases

Configure Dependabot for GitHub Actions and the selected package ecosystem. Group low-risk updates and review all action-pin changes.

Release automation is deferred until fixture tests prove version and changelog behavior for `feat`, `fix`, `perf`, `revert`, non-release changes, mixed changes, and breaking changes, including pre-1.0 behavior.

Do not use the default `GITHUB_TOKEN` to create release PRs that must trigger required CI; those events generally do not start new workflow runs. Prefer a narrowly scoped GitHub App installation token over a personal access token. Test credential expiration and release-bot recovery.

## Phase 9: deployment

After a hosting target exists:

- Define staging and production environments.
- Use short-lived OIDC credentials where supported.
- Separate build artifacts from deployment.
- Record the source commit in the artifact and live service.
- Verify the live service reports the merged commit.
- Add smoke checks and a tested rollback procedure.
- Add background-workflow alerting only after background workflows exist.

Merged, deployed, and verified remain separate states.

## Pull request and release policy

The authoritative title, scope, body, branch, and exception rules are in [pull-request-conventions.md](pull-request-conventions.md). GitHub-native issue links belong in the body. `CHANGELOG.md` is generated. Labels cannot affect releases until the release pipeline demonstrably carries that information into release output.

## Failure modes explicitly covered

- Private plan cannot enforce branch rules: stay in advisory mode.
- Required check enabled before it exists: run and prove `verify` first.
- Aggregate check becomes a facade: test dependency topology and mutation failures.
- Squash subject edited after PR-title validation: restrict final commit metadata on `main`.
- Release bot PR does not trigger CI: use a GitHub App token or keep releases manual.
- Privileged settings script drifts or partially applies: begin read-only and require snapshots and rollback.
- `various` becomes a large-PR escape hatch: require explanation and future independent approval.
- Full SHA points to the wrong source: resolve it from the official repository and review updates.
- Windows hooks depend on Bash: use cross-platform tooling or document the required environment.
- Project fields and labels duplicate state: maintain one source of truth.

## Definition of repository readiness

Repository governance is ready only when:

- Direct updates to `main` are demonstrably blocked.
- Pull requests are squash merged through one required `verify` check.
- The final commit subject satisfies the naming convention.
- Third-party actions are verified and pinned to full SHAs.
- Every guard has passing and failing tests.
- The setup works from a clean clone with documented commands.
- Issues enter the Project automatically without duplicate status systems.
- Security reports have a real private destination.
- Desired settings match live settings.

Production readiness additionally requires real application checks, reviewed data and security controls, deployment commit verification, and tested rollback.

## References

- [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
- [GitHub rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [GitHub required status checks](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks)
- [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use)
- [GitHub issue linking](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue)
- [Release Please](https://github.com/googleapis/release-please-action)
