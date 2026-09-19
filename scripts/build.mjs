import { mkdir, copyFile, cp } from 'node:fs/promises';

// The portfolio is static HTML, CSS, and browser JavaScript. Copy all its
// assets explicitly so GitHub Pages receives the same site as local preview.
await mkdir('dist', { recursive: true });
await copyFile('index.html', 'dist/index.html');
await cp('styles', 'dist/styles', { recursive: true });
await cp('assets', 'dist/assets', { recursive: true });
await mkdir('dist/scripts', { recursive: true });
for (const script of ['main.js', 'animations.js', 'portfolio.js']) {
  await copyFile(`scripts/${script}`, `dist/scripts/${script}`);
}
console.log('Built static portfolio in dist/');
