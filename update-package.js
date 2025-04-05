import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the package.json file
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Update the dev script to use JavaScript instead of TypeScript
packageJson.scripts.dev = 'node server/index.js';
packageJson.scripts.build = 'vite build && esbuild server/index.js --platform=node --packages=external --bundle --format=esm --outdir=dist';

// Write the updated package.json back to disk
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('Updated package.json dev script to use node server/index.js');