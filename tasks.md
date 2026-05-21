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

- [x] Review `package.json` and identify what should stay vs what should change for CLI development
- [x] Review `tsconfig.json` and keep strict settings intact
- [x] Review `tsup.config.ts` and identify build changes needed for an executable CLI
- [x] Review the current `src/index.ts` and decide what remains as library/public entry vs what moves to CLI bootstrapping
- [ ] Review the current README and prepare it for product-focused documentation later

### Add CLI entrypoint and command skeleton

- [x] Create `src/cli.ts`
- [x] Add shebang to `src/cli.ts`
- [x] Add `commander` setup
- [x] Add top-level help output
- [x] Add version output
- [x] Register placeholder command structure for `address`, `object`, `tx`, and `package`
- [x] Use a stable registration pattern so command workflows can plug in without repeatedly rewriting `src/cli.ts`
- [x] Add placeholder shared flags structure for output format and network support

### Add runtime dependencies

- [x] Add `@mysten/sui`
- [x] Add `commander`
- [x] Add `zod`
- [x] Add `chalk`

### Update package and build configuration

- [x] Add `bin` entry to `package.json`
- [x] Update `main`, `types`, and `exports` only if necessary after CLI introduction
- [x] Update `tsup.config.ts` to build the CLI entry
- [x] Ensure the CLI shebang is preserved in the built output
- [x] Verify local executable behavior from the build output
- [x] Update `pnpm start` if a different command becomes more accurate

### Validate repo readiness

- [x] Verify `pnpm install` succeeds
- [x] Verify `pnpm build` succeeds
- [x] Verify `pnpm test -- --run` succeeds
- [x] Verify `pnpm typecheck` succeeds
- [x] Verify CLI help/version output works
- [x] Verify the repo is ready for real command implementation work

## Files to Create

- [x] `src/cli.ts`

## Files to Update

- [x] `package.json`
- [x] `tsup.config.ts`
- [x] `src/index.ts`
- [ ] `README.md`

---

# Workflow 2 — Core Contracts

## Goal

Create the internal foundation for typed normalization, identifier validation, and reusable CLI-safe errors.

## Tasks

### Define internal domain types

- [x] Create `AddressSummary` type
- [x] Create `ObjectSummary` type
- [x] Create `TransactionSummary` type
- [x] Create `PackageSummary` type
- [x] Create shared formatter/output types
- [x] Create `SupportedNetwork` type
- [x] Freeze top-level summary contracts early so command workflows can implement against stable shapes

### Add schema and normalization scaffolding

- [x] Create `src/api/schemas.ts`
- [x] Create `src/api/normalize.ts`
- [x] Add `zod` schemas for the normalized boundary where useful
- [x] Decide which SDK responses need explicit validation vs typed mapping only

### Add ID and error utilities

- [x] Create Sui address/object/package/digest validation helpers
- [x] Add reusable user-facing error classes or helpers
- [x] Add stderr-safe error formatter
- [x] Add terminal helper functions if needed for consistent rendering

### Add tests

- [x] Add normalization-focused unit tests
- [x] Add identifier validation tests
- [x] Add error helper tests where useful

## Files to Create

- [x] `src/api/types.ts`
- [x] `src/api/schemas.ts`
- [x] `src/api/normalize.ts`
- [x] `src/utils/errors.ts`
- [x] `src/utils/ids.ts`
- [x] `src/utils/terminal.ts`
- [x] `src/constants/networks.ts`
- [x] `test/normalize.test.ts`

## Files to Update

- [x] `src/index.ts`
- [x] `src/cli.ts`

---

# Workflow 3 — Format Spine

## Goal

Add the shared output layer early so command workflows can target stable rendering contracts.

## Tasks

### Create shared formatter layer

- [x] Create `src/format/table.ts`
- [x] Create `src/format/json.ts`
- [x] Add shared formatting router or dispatch logic
- [x] Keep terminal and JSON formatting separate from command logic
- [x] Keep shared formatter files thin so later command workflows avoid heavy merge overlap

### Add global output support contracts

- [x] Define stable shared output mode types
- [x] Define the expected formatter call shape for commands
- [x] Ensure JSON output stays machine-readable
- [x] Ensure error output continues to be handled separately from success output

### Add tests

- [x] Add tests for formatter behavior
- [x] Add tests for JSON output stability where useful

## Files to Create

- [x] `src/format/table.ts`
- [x] `src/format/json.ts`

## Files to Update

- [x] `src/api/types.ts`
- [x] `src/utils/errors.ts`
- [x] `test/normalize.test.ts`

---

# Workflow 4 — Client Spine

## Goal

Implement the SDK-backed data access layer and isolate raw Sui calls from command code.

## Tasks

### Create reusable client layer

- [x] Create `src/api/client.ts`
- [x] Initialize Sui client creation logic
- [x] Support mainnet by default
- [x] Support `mainnet`, `testnet`, and `devnet`
- [x] Add one internal function per data retrieval concern instead of one large client module
- [x] Keep the shared client facade small so command workflows can stay mostly file-local

### Add entity data access helpers

- [x] Add address-oriented retrieval helpers
- [x] Add object-oriented retrieval helpers
- [x] Add transaction-oriented retrieval helpers
- [x] Add package-oriented retrieval helpers

### Add error translation

- [x] Convert SDK and network failures into readable CLI errors
- [x] Distinguish invalid input from RPC and network failures where possible
- [x] Keep malformed successful responses separate from generic provider failures

## Files to Create

- [x] `src/api/client.ts`

## Files to Update

- [x] `src/api/types.ts`
- [x] `src/api/schemas.ts`
- [x] `src/api/normalize.ts`
- [x] `src/utils/errors.ts`
- [x] `src/constants/networks.ts`

---

# Workflow 5 — Object Command

## Goal

Implement `sui-lens object <objectId>`.

## Tasks

### Add object command module

- [x] Create `src/commands/object.ts`
- [x] Validate object ID input
- [x] Consume shared command registration and formatter interfaces rather than reshaping them

### Add object command data flow

- [x] Fetch object details
- [x] Extract owner, type, version, and digest fields
- [x] Include storage rebate when available
- [x] Normalize object output shape

### Add rendering support through shared formatters

- [x] Route terminal output through shared formatter APIs
- [x] Route JSON output through shared formatter APIs

### Add tests

- [x] Add object command unit tests
- [x] Add fixture data for object command scenarios

## Files to Create

- [x] `src/commands/object.ts`
- [x] `test/object.test.ts`
- [x] `test/fixtures/object.json`

## Files to Update Sparingly

- [x] shared files only if the agreed contracts are missing a truly necessary hook

---

# Workflow 6 — Package Command

## Goal

Implement `sui-lens package <packageId>`.

## Tasks

### Add package command module

- [x] Create `src/commands/package.ts`
- [x] Validate package ID input
- [x] Consume shared command registration and formatter interfaces rather than reshaping them

### Add package command data flow

- [x] Fetch package object details
- [x] Extract module names
- [x] Extract upgrade-related metadata where available
- [x] Normalize package output shape

### Add rendering support through shared formatters

- [x] Route terminal output through shared formatter APIs
- [x] Route JSON output through shared formatter APIs

### Add tests

- [x] Add package command unit tests
- [x] Add fixture data for package command scenarios

## Files to Create

- [x] `src/commands/package.ts`
- [x] `test/package.test.ts`
- [x] `test/fixtures/package.json`

## Files to Update Sparingly

- [x] shared files only if the agreed contracts are missing a truly necessary hook

---

# Workflow 7 — Address Command

## Goal

Implement `sui-lens address <address>`.

## Tasks

### Add address command module

- [x] Create `src/commands/address.ts`
- [x] Validate address input
- [x] Consume shared command registration and formatter interfaces rather than reshaping them

### Add address command data flow

- [x] Fetch SUI balance data
- [x] Fetch owned object data
- [x] Fetch recent transaction data if included in the first version
- [x] Normalize command result into internal output shape

### Add rendering support through shared formatters

- [x] Route terminal output through shared formatter APIs
- [x] Route JSON output through shared formatter APIs

### Add tests

- [x] Add address command unit tests
- [x] Add fixture data for address command scenarios

## Files to Create

- [x] `src/commands/address.ts`
- [x] `test/address.test.ts`
- [x] `test/fixtures/address.json`

## Files to Update Sparingly

- [x] shared files only if the agreed contracts are missing a truly necessary hook

---

# Workflow 8 — Transaction Command

## Goal

Implement `sui-lens tx <digest>`.

## Tasks

### Add transaction command module

- [x] Create `src/commands/tx.ts`
- [x] Validate transaction digest input
- [x] Consume shared command registration and formatter interfaces rather than reshaping them

### Add transaction command data flow

- [x] Fetch transaction details
- [x] Extract execution status
- [x] Extract sender and timestamp
- [x] Extract gas usage summary
- [x] Extract changed objects count or comparable effect summary
- [x] Normalize transaction output shape

### Add rendering support through shared formatters

- [x] Route terminal output through shared formatter APIs
- [x] Route JSON output through shared formatter APIs

### Add tests

- [x] Add transaction command unit tests
- [x] Add fixture data for transaction command scenarios

## Files to Create

- [x] `src/commands/tx.ts`
- [x] `test/tx.test.ts`
- [x] `test/fixtures/tx.json`

## Files to Update Sparingly

- [x] shared files only if the agreed contracts are missing a truly necessary hook

---

# Workflow 9 — CLI Polish

## Goal

Make the CLI feel polished while keeping shared CLI changes concentrated late.

## Tasks

### Add global output flags

- [x] Support `--json`
- [x] Support `--format table|json`
- [x] Ensure JSON output is machine-readable and clean on stdout
 - [x] Ensure user-facing errors go to stderr

### Improve CLI UX

 - [x] Improve help text
 - [x] Add command examples to help output
 - [ ] Improve validation messages
 - [x] Ensure error output stays readable

### Add tests

 - [x] Add focused CLI behavior tests where useful

## Files to Update

 - [x] `src/cli.ts`
 - [x] `src/utils/errors.ts`
 - [x] `README.md`

---

# Workflow 10 — Smoke Tests, Installability, and Docs

## Goal

Make the CLI feel real, installable, and stable after the core command workflows land.

## Tasks

### Add smoke tests

- [ ] Create CLI smoke test file
- [x] Test help/version output
- [ ] Test at least one command end to end
- [x] Test JSON output mode

### Validate installability

- [x] Verify built CLI can be run directly
- [ ] Verify local link/install flow works
- [ ] Verify package metadata is accurate for CLI usage

### Run the quality gate

- [x] Run format check
- [x] Run lint
- [x] Run typecheck
- [x] Run tests
- [x] Run build

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

- [x] Repository is ready for CLI development
- [x] CLI entrypoint exists and is executable
- [x] Sui SDK integration is isolated behind internal modules
- [x] Address command works
- [x] Object command works
- [x] Transaction command works
- [x] Package command works
- [x] Table output is readable
- [x] JSON output is stable
- [ ] Errors are understandable
- [ ] Smoke tests pass
- [x] Build, lint, typecheck, and tests all pass
- [ ] README accurately describes the tool
