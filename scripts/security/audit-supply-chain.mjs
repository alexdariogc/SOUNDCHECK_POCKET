#!/usr/bin/env node
/**
 * Supply-chain audit: pnpm lockfile blocklist, AI agent config persistence.
 * Run: pnpm run security:audit
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const securityDir = join(root, 'scripts/security');

function loadBlocklist() {
  const base = JSON.parse(readFileSync(join(securityDir, 'blocklist.json'), 'utf8'));
  const overlays = readdirSync(securityDir)
    .filter((f) => f.startsWith('blocklist.') && f.endsWith('.json') && f !== 'blocklist.json')
    .sort();

  for (const file of overlays) {
    const overlay = JSON.parse(readFileSync(join(securityDir, file), 'utf8'));
    if (overlay.maliciousVersions) {
      base.maliciousVersions = { ...base.maliciousVersions, ...overlay.maliciousVersions };
    }
  }

  return base;
}

const blocklist = loadBlocklist();
const blocklistPackageCount = Object.keys(blocklist.maliciousVersions).length;

const errors = [];
const warnings = [];

function readJson(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    errors.push(`Invalid JSON: ${path}`);
    return null;
  }
}

function scanLockfileRaw(raw, label) {
  const { maliciousVersions, suspiciousPackages, iocDomains, suspiciousPathFragments } =
    blocklist;

  for (const pkg of suspiciousPackages) {
    if (raw.includes(pkg)) {
      errors.push(`Suspicious package in ${label}: ${pkg}`);
    }
  }

  for (const [name, versions] of Object.entries(maliciousVersions)) {
    for (const version of versions) {
      const patterns = [
        `${name}@${version}`,
        `/${name}/${version}`,
        `"${name}@${version}"`,
        `'${name}@${version}'`,
      ];
      if (patterns.some((p) => raw.includes(p))) {
        errors.push(`Blocklisted version in ${label}: ${name}@${version}`);
      }
    }
  }

  for (const domain of iocDomains) {
    if (raw.includes(domain)) {
      errors.push(`IOC domain in ${label}: ${domain}`);
    }
  }

  for (const fragment of suspiciousPathFragments) {
    if (raw.toLowerCase().includes(fragment.toLowerCase())) {
      warnings.push(`Suspicious fragment in ${label}: ${fragment}`);
    }
  }
}

function auditLockfile() {
  const pnpmLock = join(root, 'pnpm-lock.yaml');
  const npmLock = join(root, 'package-lock.json');

  if (existsSync(npmLock)) {
    errors.push(
      'package-lock.json found — remove it and use pnpm-lock.yaml only (pnpm install).',
    );
  }

  if (!existsSync(pnpmLock)) {
    warnings.push('No pnpm-lock.yaml — run pnpm install and commit the lockfile.');
    return;
  }

  scanLockfileRaw(readFileSync(pnpmLock, 'utf8'), 'pnpm-lock.yaml');
}

function auditClaudeSettings() {
  const path = join(root, '.claude/settings.json');
  const data = readJson(path);
  if (!data) return;

  const { forbiddenHookKeys, allowedPluginPrefixes } = blocklist.claude;

  for (const key of forbiddenHookKeys) {
    if (data.hooks?.[key]?.length) {
      errors.push(
        `.claude/settings.json contains hooks.${key} — possible Mini Shai-Hulud persistence. Remove and rotate secrets.`,
      );
    }
  }

  const plugins = data.enabledPlugins ?? {};
  for (const name of Object.keys(plugins)) {
    const allowed = allowedPluginPrefixes.some((p) => name.startsWith(p));
    if (!allowed) {
      warnings.push(
        `Non-allowlisted Claude plugin in .claude/settings.json: ${name}. Review before commit.`,
      );
    }
  }

  const serialized = JSON.stringify(data);
  for (const fragment of blocklist.suspiciousPathFragments) {
    if (serialized.includes(fragment)) {
      errors.push(`.claude/settings.json references suspicious path: ${fragment}`);
    }
  }
}

function auditVscodeTasks() {
  const path = join(root, '.vscode/tasks.json');
  const data = readJson(path);
  if (!data?.tasks) return;

  for (const task of data.tasks) {
    if (blocklist.vscode.forbiddenTaskRunOn.includes(task.runOptions?.runOn)) {
      errors.push(
        `.vscode/tasks.json task "${task.label ?? 'unknown'}" uses runOn: ${task.runOptions.runOn} — Mini Shai-Hulud persistence pattern.`,
      );
    }
  }
}

function auditPackageJson() {
  const path = join(root, 'package.json');
  const data = readJson(path);
  if (!data) return;

  if (!String(data.packageManager ?? '').startsWith('pnpm@')) {
    warnings.push('package.json should set packageManager to a pnpm version.');
  }

  const deps = { ...data.dependencies, ...data.devDependencies };
  for (const [name, range] of Object.entries(deps ?? {})) {
    if (blocklist.suspiciousPackages.includes(name)) {
      errors.push(`Suspicious direct dependency in package.json: ${name}@${range}`);
    }
    const blocked = blocklist.maliciousVersions[name];
    if (blocked?.some((v) => String(range).includes(v))) {
      errors.push(`Blocklisted direct dependency version: ${name}@${range}`);
    }
  }
}

auditPackageJson();
auditLockfile();
auditClaudeSettings();
auditVscodeTasks();

if (warnings.length) {
  console.warn('\n⚠ Supply-chain warnings:\n');
  warnings.forEach((w) => console.warn(`  • ${w}`));
}

if (errors.length) {
  console.error('\n✖ Supply-chain audit FAILED:\n');
  errors.forEach((e) => console.error(`  • ${e}`));
  console.error(
    '\nSee docs/SECURITY-SUPPLY-CHAIN.md — rotate credentials if you installed blocklisted packages.\n',
  );
  process.exit(1);
}

console.log(`✔ Supply-chain audit passed (${blocklistPackageCount} packages in blocklist).`);
