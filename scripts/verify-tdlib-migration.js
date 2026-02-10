/* eslint-disable no-console */

const { execSync } = require('child_process');
const os = require('os');
const path = require('path');

function run(cmd, opts = {}) {
  console.log(`[verify-tdlib] Running: ${cmd}`);
  execSync(cmd, { stdio: 'inherit', ...opts });
}

function main() {
  const platform = os.platform();

  if (platform !== 'linux') {
    console.log(
      '[verify-tdlib] This verification is designed for Linux (TDLib C++ build).',
    );
    console.log(
      '[verify-tdlib] Skipping C++ build/addon build on this platform and exiting successfully.',
    );
    console.log(
      '[verify-tdlib] Please run `npm run verify-tdlib-migration` on a Linux CI/host to perform full checks.',
    );
    return;
  }

  const rootDir = path.join(__dirname, '..');
  try {
    run('bash scripts/build-tdlib.sh', { cwd: rootDir });
    run('npm run build:tdlib-addon', { cwd: rootDir });
    run('npm run build', { cwd: rootDir });
    run('npm run test:tdlib-compare', { cwd: rootDir });
    console.log('[verify-tdlib] TDLib migration verification completed successfully.');
  } catch (error) {
    console.error('[verify-tdlib] Verification failed.', error);
    process.exit(1);
  }
}

main();

