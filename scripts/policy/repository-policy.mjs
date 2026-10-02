import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const REQUIRED_FILES = [
  '.editorconfig',
  '.gitattributes',
  '.github/CODEOWNERS',
  '.github/ISSUE_TEMPLATE/bug.yml',
  '.github/ISSUE_TEMPLATE/config.yml',
  '.github/ISSUE_TEMPLATE/feature.yml',
  '.github/dependabot.yml',
  '.github/pr-scopes.json',
  '.github/pull_request_template.md',
  '.github/workflows/ci.yml',
  'CHANGELOG.md',
  'CODE_OF_CONDUCT.md',
  'CONTRIBUTING.md',
  'LICENSE',
  'README.md',
  'ROADMAP.md',
  'SECURITY.md',
];

const TEXT_EXTENSIONS = new Set(['.json', '.md', '.mjs', '.txt', '.yaml', '.yml']);

export function walk(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const candidate = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(candidate));
    else files.push(candidate);
  }
  return files;
}

export function validateActionReference(value) {
  if (value.startsWith('./')) return null;
  if (!/^[^\s@]+@[0-9a-f]{40}$/.test(value)) {
    return `Action reference must use a full commit SHA: ${value}`;
  }
  return null;
}

export function findNoOpScripts(scripts = {}) {
  const noOp = /^(?:true|exit 0|echo\s+(?:ok|pass|passed|success))$/i;
  return Object.entries(scripts)
    .filter(([, command]) => noOp.test(command.trim()))
    .map(([name]) => name);
}

function caseSensitiveExists(root, relativePath) {
  const normalized = path.normalize(relativePath);
  if (normalized.startsWith('..')) return false;
  let current = root;
  for (const segment of normalized.split(path.sep).filter(Boolean)) {
    if (!fs.existsSync(current) || !fs.statSync(current).isDirectory()) return false;
    const actual = fs.readdirSync(current).find((entry) => entry === segment);
    if (!actual) return false;
    current = path.join(current, actual);
  }
  return fs.existsSync(current);
}

export function validateMarkdownLinks(root, markdownFiles) {
  const errors = [];
  const linkPattern = /!?\[[^\]]*\]\(([^)]+)\)/g;
  for (const file of markdownFiles) {
    const contents = fs.readFileSync(file, 'utf8');
    for (const match of contents.matchAll(linkPattern)) {
      let target = match[1].trim().replace(/^<|>$/g, '');
      if (/^(?:https?:|mailto:|#)/i.test(target)) continue;
      target = target.split('#', 1)[0].split('?', 1)[0];
      if (!target) continue;
      const base = target.startsWith('/') ? root : path.dirname(file);
      const resolved = path.resolve(base, target.replace(/^\//, ''));
      const relative = path.relative(root, resolved);
      if (!caseSensitiveExists(root, relative)) {
        errors.push(`${path.relative(root, file)} links to missing or mis-cased path: ${match[1]}`);
      }
    }
  }
  return errors;
}

export function validateRepository(root = process.cwd()) {
  const errors = [];
  const allFiles = walk(root);

  for (const required of REQUIRED_FILES) {
    if (!caseSensitiveExists(root, required)) errors.push(`Required file is missing: ${required}`);
  }
  if (fs.existsSync(path.join(root, 'PULL_REQUEST_TEMPLATE.md'))) {
    errors.push('Pull request template must live under .github/.');
  }

  const scopesPath = path.join(root, '.github', 'pr-scopes.json');
  const scopes = JSON.parse(fs.readFileSync(scopesPath, 'utf8')).scopes;
  if (!Array.isArray(scopes) || scopes.length === 0) errors.push('PR scopes must be a non-empty array.');
  if (new Set(scopes).size !== scopes.length) errors.push('PR scopes must be unique.');
  if ([...scopes].sort().join('\n') !== scopes.join('\n')) errors.push('PR scopes must be sorted.');
  if (!scopes.includes('various')) errors.push('PR scopes must include various.');

  const textFiles = allFiles.filter((file) => TEXT_EXTENSIONS.has(path.extname(file).toLowerCase()));
  const bannedPlaceholders = [
    ['REPLACE', 'ME'].join('_'),
    ['@ORG', 'platform'].join('/'),
  ];
  for (const file of textFiles) {
    const contents = fs.readFileSync(file, 'utf8');
    for (const placeholder of bannedPlaceholders) {
      if (contents.includes(placeholder)) errors.push(`${path.relative(root, file)} contains placeholder ${placeholder}.`);
    }
  }

  errors.push(...validateMarkdownLinks(root, textFiles.filter((file) => path.extname(file).toLowerCase() === '.md')));

  for (const file of textFiles.filter((candidate) => /\.ya?ml$/i.test(candidate))) {
    const contents = fs.readFileSync(file, 'utf8');
    for (const match of contents.matchAll(/^\s*-?\s*uses:\s*([^\s#]+)(?:\s+#.*)?$/gm)) {
      const error = validateActionReference(match[1]);
      if (error) errors.push(`${path.relative(root, file)}: ${error}`);
    }
  }

  const packagePath = path.join(root, 'package.json');
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    for (const name of findNoOpScripts(packageJson.scripts)) errors.push(`package.json script is a no-op: ${name}`);
  }

  const ci = fs.readFileSync(path.join(root, '.github', 'workflows', 'ci.yml'), 'utf8');
  const requiredPatterns = [
    ['pull request trigger', /^\s{2}pull_request:/m],
    ['push trigger', /^\s{2}push:/m],
    ['merge group trigger', /^\s{2}merge_group:/m],
    ['manual trigger', /^\s{2}workflow_dispatch:/m],
    ['read-only contents permission', /^permissions:\s*\n\s{2}contents:\s*read$/m],
    ['verify job', /^\s{2}verify:/m],
    ['always-running aggregate', /^\s{4}if:\s*\$\{\{ always\(\) \}\}$/m],
    ['policy dependency', /^\s{4}needs:\s*\[policy\]$/m],
  ];
  for (const [description, pattern] of requiredPatterns) {
    if (!pattern.test(ci)) errors.push(`CI workflow is missing ${description}.`);
  }
  if (/^\s+paths(?:-ignore)?:/m.test(ci)) errors.push('Required CI workflow must not use path filters.');
  if (/continue-on-error:\s*true/i.test(ci)) errors.push('Required CI workflow must not continue on error.');
  if ((ci.match(/timeout-minutes:/g) ?? []).length < 2) errors.push('Every CI job must have a timeout.');

  return errors;
}

function main() {
  const errors = validateRepository();
  if (errors.length > 0) {
    for (const error of errors) console.error(`::error title=Repository policy::${error}`);
    process.exitCode = 1;
    return;
  }
  console.log('Repository policy passed.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main();
}
