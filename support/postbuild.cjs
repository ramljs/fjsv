const fs = require('node:fs');
const path = require('node:path');

function clearPackageJson() {
  const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8'));
  delete json.private;
  delete json.scripts;
  delete json.devDependencies;
  delete json['auto-changelog'];
  fs.writeFileSync(path.resolve(__dirname, '../build/package.json'), JSON.stringify(json, undefined, 2));
}

clearPackageJson();
