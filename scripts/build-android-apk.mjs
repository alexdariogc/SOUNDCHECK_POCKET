import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const junctionRoot = 'C:\\scp\\soundcheck';
const androidDir = join(junctionRoot, 'android');
const apkOut = join(
  root,
  'android',
  'app',
  'build',
  'outputs',
  'apk',
  'release',
  'app-release.apk',
);
const distApk = join(root, 'dist', 'soundcheck-pocket-release.apk');

const javaHome =
  process.env.JAVA_HOME ??
  'C:\\Program Files\\Android\\Android Studio\\jbr';
const androidHome =
  process.env.ANDROID_HOME ??
  `${process.env.LOCALAPPDATA}\\Android\\Sdk`;

if (!existsSync(junctionRoot)) {
  mkdirSync('C:\\scp', { recursive: true });
  spawnSync('cmd', ['/c', 'mklink', '/J', junctionRoot, root], {
    stdio: 'inherit',
  });
}

const gradlew = join(androidDir, 'gradlew.bat');
const env = {
  ...process.env,
  JAVA_HOME: javaHome,
  ANDROID_HOME: androidHome,
};

// Clean native caches so gradle.properties changes (e.g. newArch) take effect.
spawnSync(gradlew, ['clean'], { cwd: androidDir, env, stdio: 'inherit', shell: true });

const build = spawnSync(
  gradlew,
  ['assembleRelease', '-x', 'lint', '-x', 'test'],
  { cwd: androidDir, env, stdio: 'inherit', shell: true },
);

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

if (!existsSync(apkOut)) {
  console.error(`APK not found: ${apkOut}`);
  process.exit(1);
}

mkdirSync(join(root, 'dist'), { recursive: true });
copyFileSync(apkOut, distApk);
console.log(`\nAPK: ${distApk}`);
