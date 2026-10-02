import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { findNoOpScripts, validateActionReference, validateMarkdownLinks } from './repository-policy.mjs';

test('accepts immutable and local action references', () => {
  assert.equal(validateActionReference('actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1'), null);
  assert.equal(validateActionReference('./.github/actions/setup'), null);
});

test('rejects tags and abbreviated action references', () => {
  assert.match(validateActionReference('actions/checkout@v7'), /full commit SHA/);
  assert.match(validateActionReference('actions/checkout@3d3c42e'), /full commit SHA/);
});

test('detects explicit no-op package scripts without flagging real commands', () => {
  assert.deepEqual(findNoOpScripts({ test: 'true', lint: 'echo ok', build: 'vite build' }), ['test', 'lint']);
});

test('detects missing local Markdown links and accepts valid links', (context) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'candidait-policy-'));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'docs'));
  fs.writeFileSync(path.join(root, 'README.md'), '[valid](docs/guide.md)\n[missing](docs/missing.md)\n');
  fs.writeFileSync(path.join(root, 'docs', 'guide.md'), '# Guide\n');
  const errors = validateMarkdownLinks(root, [path.join(root, 'README.md')]);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /docs\/missing\.md|docs\\missing\.md/);
});

test('detects link casing that differs from the repository path', (context) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'candidait-policy-'));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'docs'));
  fs.writeFileSync(path.join(root, 'README.md'), '[wrong case](Docs/guide.md)\n');
  fs.writeFileSync(path.join(root, 'docs', 'guide.md'), '# Guide\n');
  const errors = validateMarkdownLinks(root, [path.join(root, 'README.md')]);
  assert.equal(errors.length, 1);
});
