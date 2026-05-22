# Product Requirements Document (PRD)
## `sui-lens`

**Version:** 0.1  
**Status:** Implemented core scope  
**Author:** Daniel Tavares

---

## 1. Overview

`sui-lens` is a CLI-first TypeScript developer tool for inspecting Sui blockchain data from the terminal.

The goal is to accept a Sui identifier and return a concise, readable summary in terminal output or machine-readable JSON. The tool should feel like a real developer utility rather than a demo app.

The existing repository was used as the starting point for the project and has now been adapted into a real installable CLI with a dedicated entrypoint, command structure, Sui SDK integration, and output formatting layers.

---

## 2. Project Goal

Given a Sui address, object ID, transaction digest, or package ID, the CLI should print a concise and useful summary in either:

- terminal-friendly output
- JSON output for scripting

The project should also demonstrate:

- strong TypeScript and CLI architecture
- clear separation between SDK access, normalization, formatting, and command layers
- readable and actionable error handling
- a codebase that feels intentional, installable, and maintainable

---

## 3. User Stories

### Developer / CLI User

- As a developer, I want to inspect a Sui address from the terminal, so I can quickly understand balances and owned objects without using a block explorer.
- As a developer, I want to inspect a Sui object ID, so I can view metadata, ownership, and version information.
- As a developer, I want to inspect a transaction digest, so I can review execution status, gas usage, sender, and transaction effects.
- As a developer, I want to inspect a package ID, so I can explore package and module information.
- As a developer, I want JSON output support, so I can pipe results into scripts and other tools.
- As a developer, I want readable terminal output by default, so the CLI feels optimized for interactive use.
- As a developer, I want errors to be understandable, so failures from RPC access or invalid input are easy to diagnose.
- As a developer, I want typed internal models and tests around normalization and formatting, so I can trust the tool and extend it safely.

---

## 4. Requirements to Get the Repo Ready for CLI Development

This section records the preparation work that was required to make the repository ready for CLI development.

### Required preparation work

- convert the existing starter code into a dedicated CLI structure
- add a real executable entrypoint
- wire package metadata for CLI usage
- preserve executable behavior through the build pipeline
- add runtime dependencies required for the CLI
- establish the internal folder structure for API, commands, formatting, and utilities
- define the first command registration shape
- ensure the repo still passes build, test, lint, and typecheck after the CLI foundation is introduced

### Readiness outcome

The repository readiness criteria were:

- the project has a working `src/cli.ts`
- the package has a `bin` entry
- the build emits an executable CLI artifact correctly
- the command structure exists, even if command implementations are still placeholders
- local development and quality checks still work

---

## 5. Core Features

### Commands

| Command | Description |
|---|---|
| `sui-lens address <address>` | Inspect a Sui address |
| `sui-lens object <objectId>` | Inspect a Sui object |
| `sui-lens tx <digest>` | Inspect a transaction |
| `sui-lens package <packageId>` | Inspect a package |

### Output Modes

| Option | Description |
|---|---|
| default terminal output | human-readable summary |
| `--json` | emit machine-readable JSON |
| `--format table|json` | explicit formatter selection |

### Network Support

| Option | Description |
|---|---|
| default mainnet | default network |
| `--network mainnet|testnet|devnet` | optional network override |

---

## 6. Command Requirements

### Address Command

The CLI should summarize:

- address
- SUI balance summary
- owned object count
- small owned object preview list
- recent transaction count or brief summary

### Object Command

The CLI should summarize:

- object ID
- type
- version
- owner
- digest
- storage rebate when available
- selected metadata fields when available

### Transaction Command

The CLI should summarize:

- transaction digest
- execution status
- sender
- timestamp
- gas usage summary
- changed objects count
- brief transaction summary

### Package Command

The CLI should summarize:

- package ID
- module names
- upgrade-related metadata when available
- basic package summary information

---

## 7. Data Source

### Primary Data Source

- official Sui TypeScript SDK: `@mysten/sui`
- public Sui RPC access

### Recommendation

The SDK should be wrapped by a thin internal client layer so command logic and output formatting do not depend directly on raw SDK response shapes.

---

## 8. Tech Stack

| Tool | Purpose |
|---|---|
| Node.js `>=24.15.0` | runtime |
| TypeScript | language |
| pnpm `11.1.3` | package manager |
| ESM | module system |
| `tsup` | build |
| `vitest` | test runner |
| `oxlint` | linting |
| `oxfmt` | formatting |
| `@mysten/sui` | Sui SDK and RPC client |
| `commander` | CLI parsing |
| `zod` | runtime validation / normalization guardrails |

### Suggested Internal Layers

- `api/` for Sui SDK access and normalization
- `commands/` for per-command orchestration
- `format/` for table and JSON output
- `utils/` for validation, IDs, and error helpers

---

## 9. Architecture Notes and Pitfalls

### Executable CLI Packaging

One of the first real implementation risks is packaging the project as a proper CLI.

**Things to get right:**
- a dedicated CLI entrypoint
- shebang preservation in the built output
- correct `bin` mapping in `package.json`
- working local and global execution flow

### ESM Friction

The project should stay fully ESM, but executable packaging still needs care.

**Recommendation:**
- keep the project fully ESM
- add a dedicated `src/cli.ts`
- verify executable behavior early instead of late

### SDK Volatility

The Sui SDK can evolve quickly.

**Recommendation:**
- isolate SDK calls behind internal functions
- normalize responses into internal types
- avoid letting raw SDK types leak across the codebase

### Public RPC Reliability

Public RPC access is the right starting point, but it introduces variability.

**Things to expect:**
- latency spikes
- temporary RPC failures
- rate limiting or intermittent errors

**Recommendation:**
- keep user-facing errors readable
- distinguish invalid input from network failures where possible
- avoid overengineering retries early

### Output Stability

Readable terminal output and stable JSON output should be treated as separate concerns.

**Recommendation:**
- keep formatting outside command logic
- treat JSON output as a stable interface
- use normalized internal data structures before rendering

---

## 10. Not Included in This Version

The following are intentionally excluded from this version:

- web UI
- interactive TUI
- wallet integration
- transaction signing
- transaction building
- package publishing
- Move compilation workflows
- local validator orchestration
- multi-chain abstractions
- plugin ecosystem
- persistent caching
- watch mode

These can be reconsidered later, but they should not slow down the first complete release.

---

## 11. Testing Requirements

### Unit Tests

The test suite should cover:

- normalization logic
- identifier validation
- command-level transformation logic
- formatter behavior
- error formatting where useful

### CLI Smoke Tests

At minimum, the project should include:

- one end-to-end CLI execution path
- command help/version validation
- JSON output validation

---

## 12. Success Criteria

The project is ready for release when:

- [ ] the repository has been adapted into a working CLI structure
- [ ] the CLI installs and runs correctly
- [ ] all four commands execute with readable output
- [ ] `--json` output is valid and stable
- [ ] errors are understandable and useful
- [ ] tests cover normalization and command behavior
- [ ] build, lint, format, and typecheck all pass
- [ ] the README clearly explains usage and scope
- [ ] the repository feels intentional and production-minded

---

*This document is a working draft and should continue to be refined as implementation decisions are validated in code.*
