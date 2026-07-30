import fs from 'node:fs';
import path from 'node:path';

const packageRoot = process.cwd();
const packagePath = path.join(packageRoot, 'package.json');
const indexPath = path.join(packageRoot, 'lib', 'index.js');
const packageDefinition = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const index = fs.readFileSync(indexPath, 'utf8');
const versionPattern = /(version:\s*')([0-9]+\.[0-9]+\.[0-9]+)(')/;

if (!versionPattern.test(index)) {
	throw new Error(`Unable to find the embedded version in ${indexPath}.`);
}

fs.writeFileSync(indexPath, index.replace(versionPattern, `$1${packageDefinition.version}$3`));
