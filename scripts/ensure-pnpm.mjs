#!/usr/bin/env node
/** Enforce pnpm — no extra dependencies (safe on first install). */
const ua = process.env.npm_config_user_agent ?? '';
if (!ua.includes('pnpm')) {
  console.error(
    '\n✖ This project uses pnpm only.\n\n  corepack enable\n  pnpm install\n',
  );
  process.exit(1);
}
