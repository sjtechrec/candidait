import assert from 'node:assert/strict';
import test from 'node:test';
import { ALLOWED_TYPES, loadScopes, validatePullRequest } from './pr-policy.mjs';

const scopes = ['api', 'repo', 'search', 'various'];

function body(scope = 'repo', extra = '') {
  return `## Primary Scope\n\n\`${scope}\` — a clear primary boundary for this change.\n\n## Summary\n\nTest summary.\n\n## Breaking Change\n\nNot applicable.\n\n${extra}`;
}

test('accepts a conventional title and matching primary scope', () => {
  assert.deepEqual(validatePullRequest({ title: 'docs(repo): document repository policy', body: body(), scopes }), []);
});

test('rejects the wrong breaking marker position', () => {
  const errors = validatePullRequest({ title: 'feat!(api): replace response', body: body('api'), scopes });
  assert.ok(errors.some((error) => error.includes('must match')));
});

test('rejects an unknown scope', () => {
  const errors = validatePullRequest({ title: 'docs(other): document policy', body: body('other'), scopes });
  assert.ok(errors.some((error) => error.includes('Unsupported scope')));
});

test('rejects a missing primary scope value', () => {
  const errors = validatePullRequest({
    title: 'docs(repo): document policy',
    body: '## Primary Scope\n\n<!-- empty -->\n\n## Summary\n\nText',
    scopes,
  });
  assert.ok(errors.some((error) => error.includes('non-comment text')));
});

test('rejects a primary scope that differs from the title', () => {
  const errors = validatePullRequest({ title: 'docs(repo): document policy', body: body('api'), scopes });
  assert.ok(errors.some((error) => error.includes('must name')));
});

test('requires breaking details for a breaking title', () => {
  const errors = validatePullRequest({ title: 'feat(api)!: replace response', body: body('api'), scopes });
  assert.ok(errors.some((error) => error.includes('Breaking Change')));
});

test('accepts documented breaking details', () => {
  const breakingBody = body('api').replace(
    'Not applicable.',
    'Affected contract: response schema.\n\nWhat breaks: legacy clients.\n\nMigration: use v2.\n\nRollback: restore v1.',
  );
  assert.deepEqual(validatePullRequest({ title: 'feat(api)!: replace response', body: breakingBody, scopes }), []);
});

test('requires measured evidence for performance changes', () => {
  const errors = validatePullRequest({ title: 'perf(search): reduce response time', body: body('search'), scopes });
  assert.equal(errors.filter((error) => error.includes('Performance section')).length, 3);
});

test('accepts measured performance evidence', () => {
  const performance = '## Performance\n\nMethod: fixed benchmark\n\nBefore: 500 ms\n\nAfter: 250 ms';
  assert.deepEqual(
    validatePullRequest({ title: 'perf(search): reduce response time', body: body('search', performance), scopes }),
    [],
  );
});

test('requires a revert reference', () => {
  const errors = validatePullRequest({ title: 'revert(repo): restore prior policy', body: body(), scopes });
  assert.ok(errors.some((error) => error.includes('Reverts:')));
});

test('requires a substantive explanation for various', () => {
  const minimalBody = '## Primary Scope\n\n`various` — mixed.\n\n## Summary\n\nText.';
  const errors = validatePullRequest({ title: 'chore(various): update files', body: minimalBody, scopes });
  assert.ok(errors.some((error) => error.includes('substantive explanation')));
});

for (const [title, expected] of [
  ['Docs(repo): document policy', 'must match'],
  ['docs(Repo): document policy', 'must match'],
  ['docs: document policy', 'must match'],
  ['docs(repo):document policy', 'must match'],
  ['docs(repo): ', 'must match'],
  ['unknown(repo): document policy', 'Unsupported type'],
  ['docs(repo): Document policy', 'lowercase'],
  ['docs(repo): document policy.', 'period'],
  [`docs(repo): ${'a'.repeat(89)}`, '100 characters'],
  ['docs(repo): document policy (#123)', 'references belong in the body'],
  ['docs(repo): document policy GH-123', 'references belong in the body'],
  ['docs(repo): document policy [skip review]', 'opt-out'],
  ['docs(repo): document policy [skip ci]', 'opt-out'],
  ['docs(repo): document policy [actions skip]', 'opt-out'],
]) {
  test(`rejects noncompliant title: ${title}`, () => {
    const errors = validatePullRequest({ title, body: body(), scopes });
    assert.ok(errors.some((error) => error.includes(expected)), JSON.stringify(errors));
  });
}

test('accepts the 100-character title boundary and ordinary numbers', () => {
  const title = `docs(repo): ${'a'.repeat(88)}`;
  assert.equal(title.length, 100);
  assert.deepEqual(validatePullRequest({ title, body: body(), scopes }), []);
  assert.deepEqual(validatePullRequest({ title: 'docs(repo): explain 2 validation steps', body: body(), scopes }), []);
});

test('accepts every supported type with its required evidence', () => {
  for (const type of ALLOWED_TYPES) {
    const extra = type === 'perf' ? '## Performance\n\nMethod: benchmark\nBefore: 2 ms\nAfter: 1 ms'
      : type === 'revert' ? 'Reverts: #123' : '';
    assert.deepEqual(validatePullRequest({ title: `${type}(repo): update repository guidance`, body: body('repo', extra), scopes }), [], type);
  }
});

test('checks actual repository scopes rather than relying only on test-only scopes', () => {
  const repositoryScopes = loadScopes();
  for (const scope of repositoryScopes.filter((value) => value !== 'various')) {
    assert.deepEqual(validatePullRequest({ title: `docs(${scope}): document the change`, body: body(scope), scopes: repositoryScopes }), [], scope);
  }
  assert.ok(validatePullRequest({ title: 'docs(unlisted): document the change', body: body('unlisted'), scopes: repositoryScopes }).length);
});
