import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export function checkJavaScript(root = process.cwd()) {
  const tracked = spawnSync('git', ['ls-files', '-z', '--', '*.js', '*.mjs', '*.cjs'], {
    cwd: root, encoding: 'utf8',
  });
  if (tracked.error || tracked.status !== 0) throw new Error('Cannot list tracked JavaScript files.');
  const files = tracked.stdout.split('\0').filter(Boolean);
  if (!files.length) throw new Error('No tracked JavaScript files found.');
  const errors = [];
  for (const file of files) {
    const result = spawnSync(process.execPath, ['--check', path.resolve(root, file)], {
      cwd: root, encoding: 'utf8',
    });
    if (result.error || result.status !== 0) errors.push(`${file}: ${result.error?.message || result.stderr}`);
  }
  return { files, errors };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { files, errors } = checkJavaScript();
  for (const error of errors) console.error(error);
  console.log(`Checked ${files.length} JavaScript files; ${errors.length} failed.`);
  if (errors.length) process.exitCode = 1;
}
