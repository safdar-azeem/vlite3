import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');
const srcDir = path.resolve(__dirname, '../src/css');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Define the order of files to concatenate
// We recreate the structure of main.css manually but directly embedding content
// main.css has:
// @import 'tailwindcss';
// @layer theme, base, components, utilities;

let finalCss = `@import 'tailwindcss';\n@layer theme, base, components, utilities;\n\n`;

const filesToRead = ['theme.css', 'base.css', 'input.css'];

filesToRead.forEach(file => {
    const filePath = path.join(srcDir, file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        finalCss += `/* --- ${file} --- */\n${content}\n\n`;
    } else {
        console.warn(`Warning: ${file} not found at ${filePath}`);
    }
});

const outputPath = path.join(distDir, 'style.css');

if (fs.existsSync(outputPath)) {
    const existingCss = fs.readFileSync(outputPath, 'utf8');
    finalCss += `/* --- Vite Generated CSS --- */\n${existingCss}\n`;
}

fs.writeFileSync(outputPath, finalCss);

console.log(`CSS bundled successfully into ${outputPath}`);
