import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Starting Vercel build...');
console.log('Current directory:', process.cwd());
console.log('__dirname:', __dirname);

// Check if we're in the right directory
if (!existsSync('./vite.config.ts')) {
  console.error('vite.config.ts not found in current directory');
  process.exit(1);
}

try {
  // Set environment variables
  const env = {
    ...process.env,
    NODE_ENV: 'production',
    // Force Vite to use specific working directory
    VITE_CWD: process.cwd()
  };

  // Run Vite build
  console.log('Running Vite build...');
  execSync('npx vite build', { 
    stdio: 'inherit',
    env,
    cwd: process.cwd()
  });
  
  // Build the backend
  console.log('Building backend...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', {
    stdio: 'inherit',
    env
  });
  
  console.log('Build completed successfully');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
