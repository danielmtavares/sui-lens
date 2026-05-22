# sui-lens

A CLI-first tool for inspecting Sui addresses, objects, transactions, and packages from the terminal.

`sui-lens` is intended to feel like a real developer utility: small, fast, typed, scriptable, and easy to install. Instead of jumping between explorer pages, you can inspect common Sui identifiers directly from your shell and choose either human-readable output or JSON for piping into other tools.

This repository now includes a working CLI with real RPC-backed commands for addresses, objects, transactions, and packages.

## Scope

The planned command surface is:

- `sui-lens address <address>`
- `sui-lens object <objectId>`
- `sui-lens tx <digest>`
- `sui-lens package <packageId>`

Planned output and CLI behavior:

- readable terminal output by default
- `--json` output for scripting
- `--format table|json`
- optional `--network mainnet|testnet|devnet`

## Why this project exists

This project is a focused exercise in building polished developer tooling around the Sui ecosystem.

The goals are to demonstrate:

- strong TypeScript fundamentals
- clean CLI design
- safe API integration and normalization
- good developer experience
- clear separation between SDK access, command orchestration, formatting, and errors

## Status

The CLI command surface is implemented and tested:

- address lookup
- object lookup
- transaction lookup
- package lookup
- table and JSON output
- network selection for `mainnet`, `testnet`, and `devnet`

The remaining work is focused on polish, installability, smoke coverage, and keeping the docs aligned with the shipped behavior.

## Requirements

- Node.js `24.15.0` or newer
- pnpm `11.1.3`

## Local development

```bash
pnpm install
pnpm dev -- --help
pnpm start -- --help
pnpm test -- --run
pnpm build
pnpm format
pnpm check
```

## Current CLI

The CLI is available now:

```bash
sui-lens --help
sui-lens address 0x...
sui-lens object 0x...
sui-lens tx <digest>
sui-lens package 0x...
```

These commands fetch live data from the configured public Sui RPC network.

User-facing errors are written to stderr and the CLI sets non-zero exit codes for automation and scripting.

## CLI Usage

### Address

```bash
sui-lens address 0x...
sui-lens address 0x... --json
sui-lens address 0x... --network testnet
```

Current summary shape:

- address
- SUI balance summary
- owned object count
- owned object preview
- recent transaction count or summary

### Object

```bash
sui-lens object 0x...
sui-lens object 0x... --json
```

Current summary shape:

- object ID
- type
- version
- owner
- digest
- storage rebate when available
- selected metadata fields

### Transaction

```bash
sui-lens tx <digest>
sui-lens tx <digest> --json
```

Current summary shape:

- transaction digest
- execution status
- sender
- timestamp
- gas usage summary
- changed objects count
- brief transaction summary

### Package

```bash
sui-lens package 0x...
sui-lens package 0x... --json
```

Current summary shape:

- package ID
- module names
- upgrade-related metadata when available
- basic package summary information

## Example Output

Terminal output should stay concise and developer-oriented.

```text
Address: 0xabc...
Network: mainnet
SUI Balance: 12.45
Owned Objects: 18
Recent Transactions: 5
```

JSON mode is intended for piping and scripting:

```bash
sui-lens address 0x... --json
```

```json
{
  "kind": "address",
  "network": "mainnet",
  "address": "0x...",
  "balance": {
    "sui": "12.45"
  },
  "ownedObjects": {
    "count": 18
  }
}
```

## Project Structure

```text
sui-lens/
  src/
    cli.ts
    index.ts
    api/
    commands/
    format/
    utils/
    constants/
  test/
  .github/workflows/
  .githooks/
```

Planned responsibilities:

- `src/api/` — Sui SDK access and response normalization
- `src/commands/` — per-command orchestration
- `src/format/` — terminal and JSON formatters
- `src/utils/` — IDs, terminal helpers, and error helpers
- `test/` — unit and smoke tests

## Development Principles

- keep the CLI surface area intentionally small
- prefer normalized internal types over raw SDK responses
- keep JSON output stable
- keep errors readable and useful
- separate fetch, normalize, command, and format responsibilities

## Public RPC Note

The tool is expected to use the official Sui TypeScript SDK together with public RPC access.

That keeps the project simple and realistic, but it also means:

- RPC latency may vary
- public endpoints may be rate-limited
- occasional transient failures are possible

The CLI should handle those failures cleanly and present understandable error messages.

## Out of Scope

These are intentionally out of scope for this version:

- web UI
- interactive TUI
- wallet integration
- transaction signing
- transaction building
- package publishing
- Move compilation workflows
- local validator orchestration
- multi-chain abstractions
- plugin system
- persistent caching

## Future ideas

Possible next steps after the core version is solid:

- richer event and effect summaries
- watch mode
- explorer deep links
- local response caching
- object diffing
- Walrus-based archival or report export

## License

MIT
