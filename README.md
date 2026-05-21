# sui-lens

A TypeScript project scaffold for `sui-lens`.

## Project Goal

This repository starts `sui-lens` with:

- strict TypeScript defaults
- early formatting and linting rules
- a test scaffold for project code
- a simple quality gate
- lightweight GitHub automation

## Requirements

- Node.js `24.15.0` or newer
- pnpm `11.1.3`

## Local Development Setup

Install dependencies and run the local project commands:

```bash
pnpm install
pnpm dev
pnpm test -- --run
pnpm build
pnpm start
pnpm format
pnpm check
```

Stop on the first failure:

```bash
pnpm install && pnpm dev && pnpm test -- --run && pnpm build && pnpm start && pnpm format && pnpm check
```

## Project Structure

- `src/` contains the project source entry point
- `test/` contains the project test scaffold
- `.github/workflows/quality.yml` runs the quality gate in CI
- `.githooks/pre-commit` runs local pre-commit checks

## Next Step

Replace the placeholder module and placeholder test with the first real `sui-lens` implementation.
