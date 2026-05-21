# `sui-lens` Task List

This task list assumes the current repository will be used as the starting point.

The first priority is not feature work. The first priority is getting the repository ready to start building the CLI cleanly.

This plan is intentionally organized for parallel execution on independent branches based on `main`.

The goal is to maximize simultaneous implementation work while minimizing merge conflicts during sequential review and merge.

---

# Proposed File Structure

```text
sui-lens/
  src/
    cli.ts
    index.ts

    api/
      client.ts
      normalize.ts
      schemas.ts
      types.ts

    commands/
      address.ts
      object.ts
      tx.ts
      package.ts

    format/
      table.ts
      json.ts

    utils/
      errors.ts
      ids.ts
      terminal.ts

    constants/
      networks.ts

  test/
    fixtures/
      address.json
      object.json
      tx.json
      package.json

    address.test.ts
    object.test.ts
    tx.test.ts
    package.test.ts
    normalize.test.ts
    cli-smoke.test.ts

  .github/
    workflows/
      quality.yml

  .githooks/
    pre-commit

  package.json
  tsconfig.json
  tsup.config.ts
  vitest.config.ts
  README.md
  LICENSE
```

---

# Parallel Workflow Strategy

## Merge order

The recommended merge order is:

1. `codex/cli-foundation`
2. `codex/core-contracts`
3. `codex/format-spine`
4. `codex/client-spine`
5. `codex/object-command`
6. `codex/package-command`
7. `codex/address-command`
8. `codex/tx-command`
9. `codex/cli-polish`
10. `codex/smoke-installability-docs`

## Parallel execution windows

### Window 1: foundation

This window is mostly sequential because it establishes the shared seams the rest of the repo depends on.

- `codex/cli-foundation`
- `codex/core-contracts`

### Window 2: shared spines in parallel

Once core contracts are stable, these can proceed in parallel from `main`:

- `codex/format-spine`
- `codex/client-spine`

### Window 3: command implementation in parallel

Once the formatter and client layers are stable, these can proceed in parallel from `main`:

- `codex/object-command`
- `codex/package-command`
- `codex/address-command`
- `codex/tx-command`

### Window 4: final integration and validation

These should be prepared late and merged after the command branches:

- `codex/cli-polish`
- `codex/smoke-installability-docs`

## Shared chokepoints and ownership

These files require deliberate coordination because they are the highest-risk merge hotspots:

- `src/cli.ts`
  - owned primarily by `codex/cli-foundation` and `codex/cli-polish`
  - command branches should avoid editing it except for minimal final wiring if absolutely necessary
- `src/api/types.ts`
  - owned by `codex/core-contracts`
  - command branches should consume established summary shapes rather than redesigning them
- `src/api/client.ts`
  - owned by `codex/client-spine`
  - command branches should consume exported helpers instead of extending the shared client directly
- `src/format/table.ts`
  - owned by `codex/format-spine`
  - should remain a thin shared router or facade
- `src/format/json.ts`
  - owned by `codex/format-spine`
  - should remain a thin shared router or facade
- `package.json`
  - minimize churn and prefer early package wiring plus final validation only
- `README.md`
  - keep early edits minimal and do final product-facing edits late

## Branch workflow rules

- Create every branch from `main`, not from another feature branch.
- Keep each branch tightly scoped to one workflow.
- Prefer adding new files over expanding shared files.
- Keep shared-file integration as the last commit in a branch where possible.
- Rebase each branch onto current `main` before review.
- Avoid moving command-specific formatting logic into shared formatter files.
- Avoid moving command-specific provider logic into the shared client facade unless it is part of the agreed client contract.

---

# Workflow 1 — CLI Foundation

## Goal

Adapt the existing project into a proper CLI foundation so feature work can begin on top of it.

## Tasks

### Review the current project setup

- [ ] Review `package.json` and identify what should stay vs what should change for CLI development
- [ ] Review `tsconfig.json` and keep strict settings intact
- [ ] Review `tsup.config.ts` and identify build changes needed for an executable CLI
- [ ] Review the current `src/index.ts` and decide what remains as library/public entry vs what moves to CLI bootstrapping
- [ ] Review the current README and prepare it for product-focused documentation later

### Add CLI entrypoint and command skeleton

- [ ] Create `src/cli.ts`
- [ ] Add shebang to `src/cli.ts`
- [ ] Add `commander` setup
- [ ] Add top-level help output
- [ ] Add version output
- [ ] Register placeholder command structure for `address`, `object`, `tx`, and `package`
- [ ] Use a stable registration pattern so command workflows can plug in without repeatedly rewriting `src/cli.ts`
- [ ] Add placeholder shared flags structure for output format and network support

### Add runtime dependencies

- [ ] Add `@mysten/sui`
- [ ] Add `commander`
- [ ] Add `zod`
- [ ] Add `chalk`

### Update package and build configuration

- [ ] Add `bin` entry to `package.json`
- [ ] Update `main`, `types`, and `exports` only if necessary after CLI introduction
- [ ] Update `tsup.config.ts` to build the CLI entry
- [ ] Ensure the CLI shebang is preserved in the built output
- [ ] Verify local executable behavior from the build output
- [ ] Update `pnpm start` if a different command becomes more accurate

### Validate repo readiness

- [ ] Verify `pnpm install` succeeds
- [ ] Verify `pnpm build` succeeds
- [ ] Verify `pnpm test -- --run` succeeds
- [ ] Verify `pnpm typecheck` succeeds
- [ ] Verify CLI help/version output works
- [ ] Verify the repo is ready for real command implementation work

## Files to Create

- [ ] `src/cli.ts`

## Files to Update

- [ ] `package.json`
- [ ] `tsup.config.ts`
- [ ] `src/index.ts`
- [ ] `README.md`

---

# Workflow 2 — Core Contracts

## Goal

Create the internal foundation for typed normalization, identifier validation, and reusable CLI-safe errors.

## Tasks

### Define internal domain types

- [ ] Create `AddressSummary` type
- [ ] Create `ObjectSummary` type
- [ ] Create `TransactionSummary` type
- [ ] Create `PackageSummary` type
- [ ] Create shared formatter/output types
- [ ] Create `SupportedNetwork` type
- [ ] Freeze top-level summary contracts early so command workflows can implement against stable shapes

### Add schema and normalization scaffolding

- [ ] Create `src/api/schemas.ts`
- [ ] Create `src/api/normalize.ts`
- [ ] Add `zod` schemas for the normalized boundary where useful
- [ ] Decide which SDK responses need explicit validation vs typed mapping only

### Add ID and error utilities

- [ ] Create Sui address/object/package/digest validation helpers
- [ ] Add reusable user-facing error classes or helpers
- [ ] Add stderr-safe error formatter
- [ ] Add terminal helper functions if needed for consistent rendering

### Add tests

- [ ] Add normalization-focused unit tests
- [ ] Add identifier validation tests
- [ ] Add error helper tests where useful

## Files to Create

- [ ] `src/api/types.ts`
- [ ] `src/api/schemas.ts`
- [ ] `src/api/normalize.ts`
- [ ] `src/utils/errors.ts`
- [ ] `src/utils/ids.ts`
- [ ] `src/utils/terminal.ts`
- [ ] `src/constants/networks.ts`
- [ ] `test/normalize.test.ts`

## Files to Update

- [ ] `src/index.ts`
- [ ] `src/cli.ts`

---

# Workflow 3 — Format Spine

## Goal

Add the shared output layer early so command workflows can target stable rendering contracts.

## Tasks

### Create shared formatter layer

- [ ] Create `src/format/table.ts`
- [ ] Create `src/format/json.ts`
- [ ] Add shared formatting router or dispatch logic
- [ ] Keep terminal and JSON formatting separate from command logic
- [ ] Keep shared formatter files thin so later command workflows avoid heavy merge overlap

### Add global output support contracts

- [ ] Define stable shared output mode types
- [ ] Define the expected formatter call shape for commands
- [ ] Ensure JSON output stays machine-readable
- [ ] Ensure error output continues to be handled separately from success output

### Add tests

- [ ] Add tests for formatter behavior
- [ ] Add tests for JSON output stability where useful

## Files to Create

- [ ] `src/format/table.ts`
- [ ] `src/format/json.ts`

## Files to Update

- [ ] `src/api/types.ts`
- [ ] `src/utils/errors.ts`
- [ ] `test/normalize.test.ts`

---

# Workflow 4 — Client Spine

## Goal

Implement the SDK-backed data access layer and isolate raw Sui calls from command code.

## Tasks

### Create reusable client layer

- [ ] Create `src/api/client.ts`
- [ ] Initialize Sui client creation logic
- [ ] Support mainnet by default
- [ ] Support `mainnet`, `testnet`, and `devnet`
- [ ] Add one internal function per data retrieval concern instead of one large client module
- [ ] Keep the shared client facade small so command workflows can stay mostly file-local

### Add entity data access helpers

- [ ] Add address-oriented retrieval helpers
- [ ] Add object-oriented retrieval helpers
- [ ] Add transaction-oriented retrieval helpers
- [ ] Add package-oriented retrieval helpers

### Add error translation

- [ ] Convert SDK and network failures into readable CLI errors
- [ ] Distinguish invalid input from RPC and network failures where possible
- [ ] Keep malformed successful responses separate from generic provider failures

## Files to Create

- [ ] `src/api/client.ts`

## Files to Update

- [ ] `src/api/types.ts`
- [ ] `src/api/schemas.ts`
- [ ] `src/api/normalize.ts`
- [ ] `src/utils/errors.ts`
- [ ] `src/constants/networks.ts`

---

# Workflow 5 — Object Command

## Goal

Implement `sui-lens object <objectId>`.

## Tasks

### Add object command module

- [ ] Create `src/commands/object.ts`
- [ ] Validate object ID input
- [ ] Consume shared command registration and formatter interfaces rather than reshaping them

### Add object command data flow

- [ ] Fetch object details
- [ ] Extract owner, type, version, and digest fields
- [ ] Include storage rebate when available
- [ ] Normalize object output shape

### Add rendering support through shared formatters

- [ ] Route terminal output through shared formatter APIs
- [ ] Route JSON output through shared formatter APIs

### Add tests

- [ ] Add object command unit tests
- [ ] Add fixture data for object command scenarios

## Files to Create

- [ ] `src/commands/object.ts`
- [ ] `test/object.test.ts`
- [ ] `test/fixtures/object.json`

## Files to Update Sparingly

- [ ] shared files only if the agreed contracts are missing a truly necessary hook

---

# Workflow 6 — Package Command

## Goal

Implement `sui-lens package <packageId>`.

## Tasks

### Add package command module

- [ ] Create `src/commands/package.ts`
- [ ] Validate package ID input
- [ ] Consume shared command registration and formatter interfaces rather than reshaping them

### Add package command data flow

- [ ] Fetch package object details
- [ ] Extract module names
- [ ] Extract upgrade-related metadata where available
- [ ] Normalize package output shape

### Add rendering support through shared formatters

- [ ] Route terminal output through shared formatter APIs
- [ ] Route JSON output through shared formatter APIs

### Add tests

- [ ] Add package command unit tests
- [ ] Add fixture data for package command scenarios

## Files to Create

- [ ] `src/commands/package.ts`
- [ ] `test/package.test.ts`
- [ ] `test/fixtures/package.json`

## Files to Update Sparingly

- [ ] shared files only if the agreed contracts are missing a truly necessary hook

---

# Workflow 7 — Address Command

## Goal

Implement `sui-lens address <address>`.

## Tasks

### Add address command module

- [ ] Create `src/commands/address.ts`
- [ ] Validate address input
- [ ] Consume shared command registration and formatter interfaces rather than reshaping them

### Add address command data flow

- [ ] Fetch SUI balance data
- [ ] Fetch owned object data
- [ ] Fetch recent transaction data if included in the first version
- [ ] Normalize command result into internal output shape

### Add rendering support through shared formatters

- [ ] Route terminal output through shared formatter APIs
- [ ] Route JSON output through shared formatter APIs

### Add tests

- [ ] Add address command unit tests
- [ ] Add fixture data for address command scenarios

## Files to Create

- [ ] `src/commands/address.ts`
- [ ] `test/address.test.ts`
- [ ] `test/fixtures/address.json`

## Files to Update Sparingly

- [ ] shared files only if the agreed contracts are missing a truly necessary hook

---

# Workflow 8 — Transaction Command

## Goal

Implement `sui-lens tx <digest>`.

## Tasks

### Add transaction command module

- [ ] Create `src/commands/tx.ts`
- [ ] Validate transaction digest input
- [ ] Consume shared command registration and formatter interfaces rather than reshaping them

### Add transaction command data flow

- [ ] Fetch transaction details
- [ ] Extract execution status
- [ ] Extract sender and timestamp
- [ ] Extract gas usage summary
- [ ] Extract changed objects count or comparable effect summary
- [ ] Normalize transaction output shape

### Add rendering support through shared formatters

- [ ] Route terminal output through shared formatter APIs
- [ ] Route JSON output through shared formatter APIs

### Add tests

- [ ] Add transaction command unit tests
- [ ] Add fixture data for transaction command scenarios

## Files to Create

- [ ] `src/commands/tx.ts`
- [ ] `test/tx.test.ts`
- [ ] `test/fixtures/tx.json`

## Files to Update Sparingly

- [ ] shared files only if the agreed contracts are missing a truly necessary hook

---

# Workflow 9 — CLI Polish

## Goal

Make the CLI feel polished while keeping shared CLI changes concentrated late.

## Tasks

### Add global output flags

- [ ] Support `--json`
- [ ] Support `--format table|json`
- [ ] Ensure JSON output is machine-readable and clean on stdout
- [ ] Ensure user-facing errors go to stderr

### Improve CLI UX

- [ ] Improve help text
- [ ] Add command examples to help output
- [ ] Improve validation messages
- [ ] Ensure error output stays readable

### Add tests

- [ ] Add focused CLI behavior tests where useful

## Files to Update

- [ ] `src/cli.ts`
- [ ] `src/utils/errors.ts`
- [ ] `README.md`

---

# Workflow 10 — Smoke Tests, Installability, and Docs

## Goal

Make the CLI feel real, installable, and stable after the core command workflows land.

## Tasks

### Add smoke tests

- [ ] Create CLI smoke test file
- [ ] Test help/version output
- [ ] Test at least one command end to end
- [ ] Test JSON output mode

### Validate installability

- [ ] Verify built CLI can be run directly
- [ ] Verify local link/install flow works
- [ ] Verify package metadata is accurate for CLI usage

### Run the quality gate

- [ ] Run format check
- [ ] Run lint
- [ ] Run typecheck
- [ ] Run tests
- [ ] Run build

## Files to Create

- [ ] `test/cli-smoke.test.ts`

## Files to Update

- [ ] `src/cli.ts`
- [ ] `package.json`
- [ ] `README.md`
- [ ] `tsup.config.ts`
- [ ] `vitest.config.ts`

---

# Release Checklist

- [ ] Repository is ready for CLI development
- [ ] CLI entrypoint exists and is executable
- [ ] Sui SDK integration is isolated behind internal modules
- [ ] Address command works
- [ ] Object command works
- [ ] Transaction command works
- [ ] Package command works
- [ ] Table output is readable
- [ ] JSON output is stable
- [ ] Errors are understandable
- [ ] Smoke tests pass
- [ ] Build, lint, typecheck, and tests all pass
- [ ] README accurately describes the tool
