/**
 * Audit every math-bank + legacy assessment question/option that looks like
 * it needs KaTeX, and report any that still render as plain text.
 */
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { register } from 'node:module';
import { pathToFileURL } from 'url';

// Use tsx loader via dynamic import of compiled logic — duplicate import through tsx isn't available
// here as plain node. Spawn via: npx tsx scripts/audit-math-format.ts
console.log('Run with: npx tsx scripts/audit-math-format.ts');
