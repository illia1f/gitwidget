import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Build output and deps (next lint ignored these automatically; eslint CLI does not)
  { ignores: ['.next/**', 'out/**', 'next-env.d.ts'] },
  // Next.js + TypeScript recommended rules
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  // Disable rules that conflict with Prettier formatting
  ...compat.extends('prettier'),
];

export default eslintConfig;
