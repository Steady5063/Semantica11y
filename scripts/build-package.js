import { cp, mkdir, readFile, rm, writeFile } from 'fs/promises';
import path from 'path';

const root = process.cwd();
const dist = path.join(root, 'dist');

const packageJson = JSON.parse(
  await readFile(path.join(root, 'package.json'), 'utf8')
);

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await cp(path.join(root, 'src'), path.join(dist, 'src'), { recursive: true });
await cp(path.join(root, 'README.md'), path.join(dist, 'README.md'));
await cp(path.join(root, 'LICENSE'), path.join(dist, 'LICENSE'));
await cp(path.join(root, 'Semantically-logo.png'), path.join(dist, 'Semantically-logo.png'));

const distPackageJson = {
  ...packageJson,
  scripts: {
    test: packageJson.scripts.test,
  },
};

delete distPackageJson.devDependencies;

await writeFile(
  path.join(dist, 'package.json'),
  `${JSON.stringify(distPackageJson, null, 2)}\n`
);

console.log(`Built package files in ${path.relative(root, dist)}`);
