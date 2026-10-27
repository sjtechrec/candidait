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
