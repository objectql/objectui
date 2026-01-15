import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frameworkDir = path.resolve(__dirname, '../packages/runner');
const targetSymlink = path.join(frameworkDir, 'src/app-data');

// 1. Parse arguments (pnpm start:app <path>)
const args = process.argv.slice(2);
const appPathRel = args[0] || 'examples/dashboard'; // Default to dashboard

const appPath = path.resolve(process.cwd(), appPathRel);

if (!fs.existsSync(appPath)) {
  console.error(`❌ App directory not found: ${appPath}`);
  process.exit(1);
}

console.log(`🚀 Preparing to start Object UI App: ${appPathRel}`);

// 2. Create Symlink (or Junction on Windows)
try {
  if (fs.existsSync(targetSymlink)) {
    fs.unlinkSync(targetSymlink);
  }
  
  // Symlink type 'dir' for Windows compatibility
  fs.symlinkSync(appPath, targetSymlink, 'dir');
  console.log(`🔗 Linked ${appPathRel} -> src/app-data`);
} catch (e) {
  console.error('❌ Failed to create symlink:', e);
  process.exit(1);
}

// 3. Run Vite
console.log('⚡️ Starting Dev Server...');
try {
  execSync('pnpm --filter @object-ui/runner dev', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
} catch (e) {
  // Ignore SIGINT (Ctrl+C) error
}
