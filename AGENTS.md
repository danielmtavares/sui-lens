# AGENTS.md

Project-level working guidance for TypeScript CLI development in this repository.

## Engineering Principles

- Keep methods small. Split large functions early.
- Optimize for readability and maintainability over cleverness.
- Reduce nesting. Prefer early returns and small helper functions.
- Prefer `async`/`await` over chained promises and callback-heavy control flow.
- Prefer functions over classes unless there is real shared state or lifecycle.
- Follow existing project patterns before introducing new abstractions.
- Add comments sparingly, only when they help explain non-obvious code.
- Keep changes tightly scoped to the task. Avoid unrelated refactors.

## TypeScript and Modules

- Use strict TypeScript.
- Do not use `any` in public APIs or shared types.
- For Node-native ESM CLIs, use `NodeNext` for `module` and `moduleResolution`.
- Use `.js` import specifiers in TypeScript source when targeting Node ESM.
- Keep a stable public entrypoint like `src/index.ts` for package exports.
- Define explicit internal domain types and normalize external API responses into them.

## CLI Design

- Validate user input locally before making network calls.
- Keep stdout for successful output and stderr for errors.
- In JSON mode, emit machine-parseable JSON for both success and error cases.
- Define stable non-zero exit codes and document them.
- Keep command contracts precise and explicit.
- Support pagination anywhere output can become large.

## HTTP and Provider Design

- Put HTTP logic behind a shared client layer.
- Add timeouts, retries, and exponential backoff for retryable failures.
- Retry only network failures, timeouts, and 5xx responses.
- Do not retry validation failures or 404s.
- Treat malformed successful responses as validation failures, not generic provider failures.
- Hide third-party API shapes behind a provider abstraction.
- Normalize provider output into one internal model before formatting.
- Be explicit about trust boundaries for custom URLs or external inputs.

## Testing Discipline

- Treat test results as the source of truth.
- Do not change tests just to make them pass.
- Only change tests when the intended contract changed or the test was wrong.
- Add focused unit tests for utilities and edge cases.
- Add integration tests with mocks or fixtures for network behavior.
- Use snapshot tests for human-readable and JSON output where format stability matters.
- When fixing a bug, add or tighten the test that proves it.

## Documentation Discipline

- Keep README, PRD, architecture docs, and task lists aligned with actual behavior.
- Be honest in docs about what the software can and cannot infer.
- Document defaults, flags, exit codes, output shape, and error shape.
- Separate implemented behavior from future improvements.
- Treat task lists as implementation checklists, not necessarily PR plans.

## Code Review and Security

- Review for bugs, regressions, missing tests, misleading docs, and security concerns first.
- Check output contracts against implementation.
- Verify package and install behavior, not just source-level behavior.
- Be explicit about trust boundaries and unsafe inputs.

## Workflow

- Use small, focused branches and pull requests.
- Prefer non-interactive git commands.
- Do not revert unrelated existing changes.
- Keep the repository clean and publish-ready as you go.
