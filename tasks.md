# `sui-lens` Task List

This task list assumes the current repository will be used as the starting point.

The first priority is not feature work. The first priority is getting the repository ready to start building the CLI cleanly.

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

# PR 1 — Get the Repository Ready to Start Building the CLI

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

# PR 2 — Create Core Types, Validation, IDs, and Error Utilities

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

# PR 3 — Build the Sui Client Layer and Network Support

## Goal

Implement the SDK-backed data access layer and isolate raw Sui calls from command code.

## Tasks

### Create reusable client layer

- [ ] Create `src/api/client.ts`
- [ ] Initialize Sui client creation logic
- [ ] Support mainnet by default
- [ ] Support `mainnet`, `testnet`, and `devnet`
- [ ] Add one internal function per data retrieval concern instead of one large client module

### Add address-related data access

- [ ] Fetch balances
- [ ] Fetch owned objects
- [ ] Fetch recent transactions or transaction blocks

### Add object-related data access

- [ ] Fetch object details
- [ ] Fetch owner, version, and digest data

### Add transaction-related data access

- [ ] Fetch transaction block details
- [ ] Fetch gas data
- [ ] Fetch execution status

### Add package-related data access

- [ ] Fetch package object details
- [ ] Extract module names
- [ ] Extract upgrade-relevant metadata where possible

### Add error translation

- [ ] Convert SDK/network failures into readable CLI errors
- [ ] Distinguish invalid input from RPC/network failures where possible

## Files to Create

- [ ] `src/api/client.ts`

## Files to Update

- [ ] `src/api/types.ts`
- [ ] `src/api/schemas.ts`
- [ ] `src/api/normalize.ts`
- [ ] `src/utils/errors.ts`
- [ ] `src/constants/networks.ts`

---

# PR 4 — Implement the Address Command

## Goal

Implement `sui-lens address <address>`.

## Tasks

### Add address command module

- [ ] Create `src/commands/address.ts`
- [ ] Register the command in `src/cli.ts`
- [ ] Validate address input

### Add address command data flow

- [ ] Fetch SUI balance data
- [ ] Fetch owned object data
- [ ] Fetch recent transaction data if included in the first version
- [ ] Normalize command result into internal output shape

### Add rendering support

- [ ] Add terminal formatter support for address summaries
- [ ] Add JSON formatter support for address summaries

### Add tests

- [ ] Add address command unit tests
- [ ] Add fixture data for address command scenarios

## Files to Create

- [ ] `src/commands/address.ts`
- [ ] `test/address.test.ts`
- [ ] `test/fixtures/address.json`

## Files to Update

- [ ] `src/cli.ts`
- [ ] `src/api/client.ts`
- [ ] `src/api/types.ts`
- [ ] `src/api/normalize.ts`
- [ ] `src/format/table.ts`
- [ ] `src/format/json.ts`

---

# PR 5 — Implement the Object Command

## Goal

Implement `sui-lens object <objectId>`.

## Tasks

### Add object command module

- [ ] Create `src/commands/object.ts`
- [ ] Register the command in `src/cli.ts`
- [ ] Validate object ID input

### Add object command data flow

- [ ] Fetch object details
- [ ] Extract owner, type, version, and digest fields
- [ ] Include storage rebate when available
- [ ] Normalize object output shape

### Add rendering support

- [ ] Add terminal formatter support for object summaries
- [ ] Add JSON formatter support for object summaries

### Add tests

- [ ] Add object command unit tests
- [ ] Add fixture data for object command scenarios

## Files to Create

- [ ] `src/commands/object.ts`
- [ ] `test/object.test.ts`
- [ ] `test/fixtures/object.json`

## Files to Update

- [ ] `src/cli.ts`
- [ ] `src/api/client.ts`
- [ ] `src/api/types.ts`
- [ ] `src/api/normalize.ts`
- [ ] `src/format/table.ts`
- [ ] `src/format/json.ts`

---

# PR 6 — Implement the Transaction Command

## Goal

Implement `sui-lens tx <digest>`.

## Tasks

### Add transaction command module

- [ ] Create `src/commands/tx.ts`
- [ ] Register the command in `src/cli.ts`
- [ ] Validate transaction digest input

### Add transaction command data flow

- [ ] Fetch transaction details
- [ ] Extract execution status
- [ ] Extract sender and timestamp
- [ ] Extract gas usage summary
- [ ] Extract changed objects count or comparable effect summary
- [ ] Normalize transaction output shape

### Add rendering support

- [ ] Add terminal formatter support for transaction summaries
- [ ] Add JSON formatter support for transaction summaries

### Add tests

- [ ] Add transaction command unit tests
- [ ] Add fixture data for transaction command scenarios

## Files to Create

- [ ] `src/commands/tx.ts`
- [ ] `test/tx.test.ts`
- [ ] `test/fixtures/tx.json`

## Files to Update

- [ ] `src/cli.ts`
- [ ] `src/api/client.ts`
- [ ] `src/api/types.ts`
- [ ] `src/api/normalize.ts`
- [ ] `src/format/table.ts`
- [ ] `src/format/json.ts`

---

# PR 7 — Implement the Package Command

## Goal

Implement `sui-lens package <packageId>`.

## Tasks

### Add package command module

- [ ] Create `src/commands/package.ts`
- [ ] Register the command in `src/cli.ts`
- [ ] Validate package ID input

### Add package command data flow

- [ ] Fetch package object details
- [ ] Extract module names
- [ ] Extract upgrade-related metadata where available
- [ ] Normalize package output shape

### Add rendering support

- [ ] Add terminal formatter support for package summaries
- [ ] Add JSON formatter support for package summaries

### Add tests

- [ ] Add package command unit tests
- [ ] Add fixture data for package command scenarios

## Files to Create

- [ ] `src/commands/package.ts`
- [ ] `test/package.test.ts`
- [ ] `test/fixtures/package.json`

## Files to Update

- [ ] `src/cli.ts`
- [ ] `src/api/client.ts`
- [ ] `src/api/types.ts`
- [ ] `src/api/normalize.ts`
- [ ] `src/format/table.ts`
- [ ] `src/format/json.ts`

---

# PR 8 — Add Shared Formatting and Output Mode Support

## Goal

Add clean human-readable output and stable JSON output across commands.

## Tasks

### Add shared formatter modules

- [ ] Create `src/format/table.ts`
- [ ] Create `src/format/json.ts`
- [ ] Add shared formatting router or dispatch logic
- [ ] Keep terminal and JSON formatting separate from command logic

### Add global output flags

- [ ] Support `--json`
- [ ] Support `--format table|json`
- [ ] Ensure JSON output is machine-readable and clean on stdout
- [ ] Ensure user-facing errors go to stderr

### Polish formatting behavior

- [ ] Standardize headings, spacing, and field ordering
- [ ] Add color carefully where useful
- [ ] Keep output concise and readable

### Add tests

- [ ] Add tests for formatter behavior
- [ ] Add tests for JSON output stability where useful

## Files to Create

- [ ] `src/format/table.ts`
- [ ] `src/format/json.ts`

## Files to Update

- [ ] `src/cli.ts`
- [ ] `src/commands/address.ts`
- [ ] `src/commands/object.ts`
- [ ] `src/commands/tx.ts`
- [ ] `src/commands/package.ts`
- [ ] `src/utils/errors.ts`
- [ ] `test/normalize.test.ts`

---

# PR 9 — Add CLI UX Polish, Smoke Tests, and Installability Checks

## Goal

Make the CLI feel real, installable, and stable.

## Tasks

### Improve CLI UX

- [ ] Improve help text
- [ ] Add command examples to help output
- [ ] Improve validation messages
- [ ] Ensure error output stays readable

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

# PR 10 — Final Documentation and Repository Polish

## Goal

Bring the repo to a clear, polished, ready-to-share state.

## Tasks

### Finalize documentation

- [ ] Update `README.md` with real usage examples once commands exist
- [ ] Add installation instructions for the real CLI flow
- [ ] Add JSON usage examples based on actual output
- [ ] Add architecture reference or link to `architecture.md`
- [ ] Make sure documented behavior matches implementation exactly

### Final cleanup

- [ ] Remove placeholder code no longer needed
- [ ] Remove dead exports or unused helpers
- [ ] Review naming consistency across commands and types
- [ ] Review file layout and move anything that feels misplaced

### Final validation

- [ ] Confirm all planned commands exist
- [ ] Confirm docs match behavior
- [ ] Confirm repo feels intentional and production-minded

## Files to Update

- [ ] `README.md`
- [ ] `PRD.md`
- [ ] `tasks.md`
- [ ] `architecture.md`
- [ ] `package.json`
- [ ] `src/index.ts`

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
