const fs = require('fs');
const path = require('path');
const execa = require('execa');

const cwd = process.cwd();
const pkg = fs.readFileSync(path.join(cwd, 'package.json'));
const pkgJson = JSON.parse(pkg);
const hooks = pkgJson.gitHooks || {};
if (pkgJson.scripts && pkgJson.scripts.precommit) {
  hooks['pre-commit'] = 'npm run precommit';
}
if (!hooks) {
  process.exit(0);
}

const hook = process.argv[2];
const command = hooks[hook];
if (!command) {
  process.exit(0);
}

console.log(` > running ${hook} hook: ${command}`);
try {
  execa.shellSync(command, { stdio: 'inherit' });
} catch (e) {
  process.exit(1);
}
