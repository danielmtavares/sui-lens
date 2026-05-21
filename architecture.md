# Architecture

This diagram shows the planned architecture for `sui-lens` based on the current PRD and task list.

It reflects the intended flow from CLI input to command handling, Sui SDK access, normalization, formatting, and final terminal or JSON output.

```mermaid
flowchart TB
  User["CLI User"] --> Terminal["Terminal / Shell"]

  Terminal --> CLI["src/cli.ts<br/>CLI entry + command registration"]

  CLI --> AddressCmd["src/commands/address.ts<br/>sui-lens address <address>"]
  CLI --> ObjectCmd["src/commands/object.ts<br/>sui-lens object <objectId>"]
  CLI --> TxCmd["src/commands/tx.ts<br/>sui-lens tx <digest>"]
  CLI --> PackageCmd["src/commands/package.ts<br/>sui-lens package <packageId>"]

  CLI --> Flags["Global Flags<br/>--json<br/>--format table|json<br/>--network ..."]

  AddressCmd --> IdUtils["src/utils/ids.ts<br/>identifier validation"]
  ObjectCmd --> IdUtils
  TxCmd --> IdUtils
  PackageCmd --> IdUtils

  AddressCmd --> ApiClient["src/api/client.ts<br/>Sui client wrapper"]
  ObjectCmd --> ApiClient
  TxCmd --> ApiClient
  PackageCmd --> ApiClient

  ApiClient --> Networks["src/constants/networks.ts<br/>network selection"]
  Networks --> SuiSDK["@mysten/sui"]
  ApiClient --> SuiSDK
  SuiSDK --> PublicRPC["Public Sui RPC endpoint"]

  PublicRPC --> RawData["Raw SDK / RPC responses"]
  RawData --> Schemas["src/api/schemas.ts<br/>Zod validation"]
  Schemas --> Normalize["src/api/normalize.ts<br/>normalize to internal models"]
  Normalize --> Types["src/api/types.ts<br/>AddressSummary / ObjectSummary / TransactionSummary / PackageSummary"]

  Types --> AddressCmd
  Types --> ObjectCmd
  Types --> TxCmd
  Types --> PackageCmd

  AddressCmd --> FormatterRouter["Formatting router"]
  ObjectCmd --> FormatterRouter
  TxCmd --> FormatterRouter
  PackageCmd --> FormatterRouter
  Flags --> FormatterRouter

  FormatterRouter --> TableFmt["src/format/table.ts<br/>human-readable terminal output"]
  FormatterRouter --> JsonFmt["src/format/json.ts<br/>machine-readable JSON"]

  TableFmt --> Stdout["stdout"]
  JsonFmt --> Stdout

  CLI --> Errors["src/utils/errors.ts<br/>error formatting"]
  Errors --> Stderr["stderr"]

  subgraph Tests["Tests / Verification"]
    Vitest["Vitest"]
    Fixtures["test/fixtures/*.json"]
    NormalizeTest["test/normalize.test.ts"]
    AddressTest["test/address.test.ts"]
    ObjectTest["test/object.test.ts"]
    TxTest["test/tx.test.ts"]
    PackageTest["test/package.test.ts"]
    CliSmoke["test/cli-smoke.test.ts"]
  end

  Vitest --> NormalizeTest
  Vitest --> AddressTest
  Vitest --> ObjectTest
  Vitest --> TxTest
  Vitest --> PackageTest
  Vitest --> CliSmoke
  Fixtures --> NormalizeTest
  Fixtures --> AddressTest
  Fixtures --> ObjectTest
  Fixtures --> TxTest
  Fixtures --> PackageTest

  subgraph Build["Build / Quality / Packaging"]
    TS["TypeScript strict mode"]
    TSUP["tsup"]
    TSC["tsc --noEmit"]
    OXLINT["oxlint"]
    OXFMT["oxfmt"]
    Dist["dist/"]
    Package["package.json"]
  end

  TS --> TSC
  TS --> TSUP
  Package --> CLI
  Package --> TSUP
  TSUP --> Dist
  OXLINT --> CLI
  OXFMT --> CLI
```

## Summary

The architecture is organized into three layers:

- CLI interaction and command routing
- data access, normalization, validation, and formatting
- testing, quality checks, and packaging

The key design principle is to keep raw SDK access separate from command logic and output formatting so the codebase stays easier to test, maintain, and extend.
