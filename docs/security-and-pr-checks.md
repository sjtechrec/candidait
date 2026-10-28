# Security and pull request checks

## Automated checks

The `CI` workflow runs on pull requests, pushes to `main`, merge groups, and
manual requests. `policy` tests repository guards and validates repository and
PR conventions. `javascript` checks every tracked JavaScript file for syntax
errors without executing it. The stable `verify` check fails if either job
fails or is skipped. These checks do not replace browser or behavior tests.

Run the same checks locally with Node.js from `.node-version`:

```powershell
node --test scripts/policy/*.test.mjs scripts/settings/*.test.mjs scripts/checks/*.test.mjs
node scripts/policy/repository-policy.mjs
node scripts/checks/javascript.mjs
```

`CodeQL` scans workflow definitions and JavaScript on PRs into `main`, pushes
to `main`, every Monday, and manual requests. Findings appear under GitHub
Security > Code scanning. A successful scan means analysis completed; it does
not mean there are no vulnerabilities. Code scanning merge protection is a
separate repository rule and is not implied by requiring `verify`.

Both workflows use GitHub-hosted runners, full-SHA action references,
timeouts, and read-only contents access. Only CodeQL's analysis job receives
`security-events: write`. PR checks receive no deployment credentials and do
not use `pull_request_target`. Dependabot maintains action pins weekly.

## AI review

`.coderabbit.yaml` configures CodeRabbit to automatically review non-draft PRs
and new pushes. Reviews focus on defects, security, privacy, regressions, and
tests for changed behavior. AI feedback is advisory; maintainers decide how
to resolve it. AI reviews are not configured to approve or merge changes.

CodeRabbit's title and description pre-merge checks are disabled because
`policy` owns the repository's PR metadata conventions. The bot may still assess
whether a change actually fulfills its description or linked issue.

## Check responsibilities and duplication audit

Audited on 2026-10-28 against live configuration, workflow job steps, validation
scripts, and the CodeRabbit review on PR #17.

| Visible check | Owns | Does not do |
| --- | --- | --- |
| CI / policy | Repository rules, local Markdown links, action pin format, PR metadata rules, and tests of the check scripts | Validate all application JavaScript syntax or scan application data flow |
| CI / javascript | Parse every tracked JS/MJS/CJS file with the selected Node runtime, without executing it | Run behavioral tests or security queries |
| CI / verify | Fail the stable required merge gate if policy or javascript fails, is canceled, or is skipped | Check out code, rerun tests, or run scanners |
| CodeQL (actions) | Analyze GitHub Actions workflows for security problems | Analyze application JavaScript |
| CodeQL (javascript-typescript) | Analyze JavaScript/TypeScript for security problems | Validate PR metadata or analyze workflow YAML |
| Code scanning results / CodeQL | Evaluate uploaded findings against the PR diff and report new alerts | Run another CodeQL scan |
| CodeRabbit | Contextual review of changed behavior, regressions, missing tests, and cross-file inconsistencies | Own deterministic PR metadata rules or repeat existing CI findings |

`policy` tests the syntax checker against small fixtures; `javascript` applies
that checker to the repository. Testing a guard and using it are different
responsibilities. Parsing a file as part of a test or security analysis is an
implementation prerequisite, not another full syntax-validation job.

The two CodeQL matrix jobs target distinct languages. GitHub's results check
consumes their uploaded findings; it is not a third scanner. GitHub's default
CodeQL setup is disabled: only `.github/workflows/codeql.yml` owns CodeQL scans.
Do not enable default setup alongside it.

CodeRabbit also has built-in analysis tools. Their enabled defaults are not
evidence that every tool ran on a given PR. Different lint or security engines
can have overlapping findings without identical coverage; retain complementary
coverage and have the bot avoid duplicate feedback rather than claiming zero
overlap or disabling tools merely because they share a language.

PR scans assess the proposed merge; push scans maintain the actual `main`
baseline, and scheduled scans apply updated security queries even when source
has not changed. These triggers serve different lifecycle purposes. They are
not two scanners running on the same PR event.

Only `verify` is required by the current branch ruleset. It aggregates `policy`
and `javascript`, not CodeQL or CodeRabbit. A displayed successful check is not
necessarily a required merge gate. Keep that distinction explicit when changing
merge requirements.

References: [CodeRabbit configuration](https://docs.coderabbit.ai/reference/configuration)
and [GitHub code scanning results](https://docs.github.com/en/code-security/how-tos/manage-security-alerts/manage-code-scanning-alerts/triage-alerts-in-pull-requests).

## AI review activation

The YAML file alone does not activate CodeRabbit. Install the
[CodeRabbit GitHub App](https://github.com/apps/coderabbitai) with access to
only `sjtechrec/candidait`, then confirm automatic reviews are enabled in its
dashboard. CodeRabbit currently offers free reviews for public repositories,
subject to its usage limits. Confirm eligibility if visibility changes.

Verify activation by opening a small PR and pushing a follow-up commit.
Confirm the bot reviewed the latest revision. Do not make its check required
until normal, skipped, and failed reviews have been observed. Keep automatic
code changes and auto-merge disabled during this initial rollout.

## Repository controls

Enable secret scanning and secret push protection, Dependabot alerts, and
Dependabot security updates in repository security settings. Push protection
blocks supported secret patterns; it cannot detect every credential.

Require `verify` from the GitHub Actions app in the default branch ruleset
after confirming it succeeds on this PR. Require branches to be up to date.
Preserve the existing PR requirement, conversation resolution, deletion
protection, and force-push protection. With one maintainer, do not require
an approval the author cannot provide. Add independent approval and code-owner
review when a second trusted maintainer joins.

The older repository setup plan records historical private-repository limits.
The repository was public when these changes were prepared on 2026-10-27;
check live settings rather than treating that historical plan as current state.

## Rollback

Revert the workflow/configuration PR to remove these file changes. To stop AI
reviews immediately, disable CodeRabbit for this repository in its dashboard.
If a new required check prevents recovery, edit the ruleset to remove only
that check, repair CI through a PR, and restore the check after verification.
Keep secret protection enabled unless a concrete operational issue requires
a separately reviewed change.
