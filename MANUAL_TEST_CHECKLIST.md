# Manual Test Checklist

Use this checklist to manually validate `sui-lens` beyond the automated unit and integration tests.

## 1. Environment

- Confirm Node.js is `24.15.0` or newer.
- Confirm pnpm is `11.1.3`.
- Install dependencies with `pnpm install`.
- Build the CLI with `pnpm build`.

## 2. CLI Entrypoints

Verify both the development entrypoint and the built artifact:

- `pnpm dev -- --help`
- `pnpm start -- --help`
- `node dist/cli.js --help`

Check that:

- the root help output renders successfully
- the help text includes the usage examples from `src/cli.ts`
- the version flag works: `pnpm dev -- --version`

## 3. Known Validation IDs

Use these real-world IDs for manual smoke tests.

- Address: `0xac5bceec1b789ff840d7d4e6ce4ce61c90d190a7f8c4f4ddf0bff6ee2413c33c`
- Object: `0x00cb1675990d628ff2976f53084181df2fd0b8d8e906b85f93d31671d17f41c3`
- Transaction digest: `3CBjjegmN5jjcUHRz3CNoKEHESFpPRpH1UeNfm17bV4N`
- Package ID: `0x0000000000000000000000000000000000000000000000000000000000000003`

Source notes:

- Address source: [MystenLabs/sui issue #17198](https://github.com/MystenLabs/sui/issues/17198)
- Object source: [SuiVision object page](https://suivision.xyz/object/0x00cb1675990d628ff2976f53084181df2fd0b8d8e906b85f93d31671d17f41c3)
- Transaction source: [SuiVision transaction page](https://suivision.xyz/txblock/3CBjjegmN5jjcUHRz3CNoKEHESFpPRpH1UeNfm17bV4N)
- Package source: [SuiVision package page](https://suivision.xyz/package/0x0000000000000000000000000000000000000000000000000000000000000003)

Note:

- Object IDs are the least stable of the four. If this object is deleted by the time you run the checklist, replace it with a current explorer-backed live object and keep the rest of the checklist the same.

## 4. Live Command Smoke Tests

Run each command once in table mode:

- `pnpm dev -- address 0xac5bceec1b789ff840d7d4e6ce4ce61c90d190a7f8c4f4ddf0bff6ee2413c33c`
- `pnpm dev -- object 0x00cb1675990d628ff2976f53084181df2fd0b8d8e906b85f93d31671d17f41c3`
- `pnpm dev -- tx 3CBjjegmN5jjcUHRz3CNoKEHESFpPRpH1UeNfm17bV4N`
- `pnpm dev -- package 0x0000000000000000000000000000000000000000000000000000000000000003`

Confirm that:

- each command exits successfully
- each command writes only the success payload to stdout
- table output is readable and concise
- the reported kind matches the command you ran

## 5. JSON Output Checks

Run each command again in JSON mode:

- `pnpm dev -- address 0xac5bceec1b789ff840d7d4e6ce4ce61c90d190a7f8c4f4ddf0bff6ee2413c33c --json`
- `pnpm dev -- object 0x00cb1675990d628ff2976f53084181df2fd0b8d8e906b85f93d31671d17f41c3 --json`
- `pnpm dev -- tx 3CBjjegmN5jjcUHRz3CNoKEHESFpPRpH1UeNfm17bV4N --json`
- `pnpm dev -- package 0x0000000000000000000000000000000000000000000000000000000000000003 --json`

Also compare one run using `--format json`:

- `pnpm dev -- address 0xac5bceec1b789ff840d7d4e6ce4ce61c90d190a7f8c4f4ddf0bff6ee2413c33c --format json`

Confirm that:

- the output is valid JSON
- `--json` and `--format json` produce the same structure
- the payload includes the expected `kind`
- the payload includes the selected `network`
- null or missing values are represented consistently

## 6. Network Checks

Exercise the network flag with at least one command:

- `pnpm dev -- package 0x0000000000000000000000000000000000000000000000000000000000000003 --network mainnet`
- `pnpm dev -- package 0x0000000000000000000000000000000000000000000000000000000000000003 --network testnet`
- `pnpm dev -- package 0x0000000000000000000000000000000000000000000000000000000000000003 --network devnet`

Confirm that:

- the command accepts each supported network
- the reported network value matches the flag
- failures on unsupported or unavailable IDs are still clear and well-formed

## 7. Error Handling

Run a focused set of invalid-input checks:

- `pnpm dev -- address not-an-id`
- `pnpm dev -- object not-an-id`
- `pnpm dev -- package not-an-id`
- `pnpm dev -- tx not-a-digest`
- `pnpm dev -- address`
- `pnpm dev -- nonsense`

Confirm that:

- malformed identifiers fail before any RPC lookup
- the error message explains what format was expected
- the error is written to stderr
- the process exits non-zero
- missing arguments and unknown commands are handled cleanly

## 8. Installability And Packaging

Validate the publishable artifact, not just the dev entrypoint:

- `pnpm check`
- `pnpm pack`
- `pnpm start -- --help`
- `node dist/cli.js package 0x0000000000000000000000000000000000000000000000000000000000000003`

Confirm that:

- the quality gate passes
- the packed artifact builds cleanly
- the built CLI behaves the same way as `pnpm dev --`

## 9. Final Sign-Off

Consider the manual pass complete when all of the following are true:

- help and version output look correct
- each live command works at least once against mainnet data
- JSON output is parseable and stable
- invalid inputs fail with readable errors
- the built artifact works from `dist`
- `pnpm check` and `pnpm pack` pass
