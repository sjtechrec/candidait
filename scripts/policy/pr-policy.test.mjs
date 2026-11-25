import assert from 'node:assert/strict';
import test from 'node:test';
import { ALLOWED_TYPES, validatePullRequest } from './pr-policy.mjs';

function body(scope = 'repo', extra = '') {
  return `## Primary Scope\n\n\`${scope}\` — a clear primary boundary for this change.\n\n## Summary\n\nTest summary.\n\n## Breaking Change\n\nNot applicable.\n\n${extra}`;
}

test('accepts a conventional title and matching primary scope', () => {
  assert.deepEqual(validatePullRequest({ title: 'docs(repo): document repository policy', body: body() }), []);
});

test('rejects the wrong breaking marker position', () => {
  const errors = validatePullRequest({ title: 'feat!(api): replace response', body: body('api') });
  assert.ok(errors.some((error) => error.includes('must match')));
});

test('accepts descriptive and optional scopes without a separate scope section', () => {
  for (const title of ['docs(help-center): document support', 'docs: document support']) {
    assert.deepEqual(validatePullRequest({ title, body: '## Summary\n\nDocument support.' }), []);
  }
});

test('rejects a primary scope that differs from the title', () => {
  const errors = validatePullRequest({ title: 'docs(repo): document policy', body: body('api') });
  assert.ok(errors.some((error) => error.includes('must name')));
});

test('requires breaking details for a breaking title', () => {
  const errors = validatePullRequest({ title: 'feat(api)!: replace response', body: body('api') });
  assert.ok(errors.some((error) => error.includes('Breaking Change')));
});

test('accepts documented breaking details', () => {
  const breakingBody = body('api').replace(
    'Not applicable.',
    'Affected contract: response schema.\n\nWhat breaks: legacy clients.\n\nMigration: use v2.\n\nRollback: restore v1.',
  );
  assert.deepEqual(validatePullRequest({ title: 'feat(api)!: replace response', body: breakingBody }), []);
});

test('requires measured evidence for latency changes', () => {
  const errors = validatePullRequest({ title: 'latency(search): reduce response time', body: body('search') });
  assert.equal(errors.filter((error) => error.includes('Performance section')).length, 3);
});

test('accepts measured performance evidence', () => {
  const performance = '## Performance\n\nMethod: fixed benchmark\n\nBefore: 500 ms\n\nAfter: 250 ms';
  assert.deepEqual(
    validatePullRequest({ title: 'latency(search): reduce response time', body: body('search', performance) }),
    [],
  );
});

test('requires a revert reference', () => {
  const errors = validatePullRequest({ title: 'revert(repo): restore prior policy', body: body() });
  assert.ok(errors.some((error) => error.includes('Reverts:')));
});

test('requires a substantive explanation for various', () => {
  const minimalBody = '## Primary Scope\n\n`various` — mixed.\n\n## Summary\n\nText.';
  const errors = validatePullRequest({ title: 'chore(various): update files', body: minimalBody });
  assert.ok(errors.some((error) => error.includes('substantive explanation')));
});

for (const [title, expected] of [
  ['Docs(repo): document policy', 'must match'],
  ['docs(Repo): document policy', 'must match'],
  ['docs(repo):document policy', 'must match'],
  ['docs(repo): ', 'must match'],
  ['unknown(repo): document policy', 'Unsupported type'],
  ['docs(repo): Document policy', 'lowercase'],
  ['docs(help_center): document policy', 'must match'],
  ['ci(ci): update CI', 'Unsupported type'],
  ['perf(search): reduce response time', 'Unsupported type'],
  ['build(ci): update build tooling', 'Unsupported type'],
  ['test(repo): add a regression test', 'Unsupported type'],
  ['docs(repo): document policy (#123)', 'references belong in the body'],
  ['docs(repo): document policy GH-123', 'references belong in the body'],
  ['docs(repo): document policy https://github.com/owner/repo/issues/123', 'references belong in the body'],
  ['docs(repo): document policy https://github.com/owner/repo/pull/123', 'references belong in the body'],
  ['docs(repo): document policy [skip review]', 'opt-out'],
  ['docs(repo): document policy [skip ci]', 'opt-out'],
  ['docs(repo): document policy [actions skip]', 'opt-out'],
  ['docs(repo): document policy skip-changelog', 'opt-out'],
  ['docs(repo): document policy no-arch-change', 'opt-out'],
]) {
  test(`rejects noncompliant title: ${title}`, () => {
    const errors = validatePullRequest({ title, body: body() });
    assert.ok(errors.some((error) => error.includes(expected)), JSON.stringify(errors));
  });
}

test('accepts ordinary numbers, links, and longer titles', () => {
  const title = `docs(repo): ${'a'.repeat(89)}`;
  assert.ok(title.length > 100);
  assert.deepEqual(validatePullRequest({ title, body: body() }), []);
  assert.deepEqual(validatePullRequest({ title: 'docs(repo): explain 2 validation steps', body: body() }), []);
  assert.deepEqual(validatePullRequest({ title: 'docs(repo): explain https://github.com/owner/repo/wiki', body: body() }), []);
});

test('accepts every supported type with its required evidence', () => {
  for (const type of ALLOWED_TYPES) {
    const extra = type === 'latency' ? '## Performance\n\nMethod: benchmark\nBefore: 2 ms\nAfter: 1 ms'
      : type === 'revert' ? 'Reverts: #123' : '';
    assert.deepEqual(validatePullRequest({ title: `${type}(repo): update repository guidance`, body: body('repo', extra) }), [], type);
  }
});

test('requires breaking details even when a title omits the scope', () => {
  assert.ok(validatePullRequest({ title: 'feat!: replace response', body: body() })
    .some((error) => error.includes('Breaking Change')));
});
