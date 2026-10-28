import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { checkJavaScript } from './javascript.mjs';

test('checks tracked files with spaces and reports invalid syntax without executing code', (context) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'candidait-syntax-'));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  execFileSync('git', ['init', '--quiet', root]);
  fs.writeFileSync(path.join(root, 'valid file.mjs'), 'throw new Error("must not execute");\n');
  fs.writeFileSync(path.join(root, 'broken.js'), 'const broken = ;\n');
  fs.writeFileSync(path.join(root, 'untracked.js'), 'const ignored = ;\n');
  execFileSync('git', ['add', '--', 'valid file.mjs', 'broken.js'], { cwd: root });
  const result = checkJavaScript(root);
  assert.equal(result.files.length, 2);
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /broken\.js/);
  fs.writeFileSync(path.join(root, 'broken.js'), 'const repaired = true;\n');
  assert.deepEqual(checkJavaScript(root).errors, []);
});
