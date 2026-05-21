export const EXIT_CODES = {
  INVALID_INPUT: 2,
  NETWORK_FAILURE: 3,
  PROVIDER_FAILURE: 4,
  VALIDATION_FAILURE: 5,
  UNKNOWN_FAILURE: 1,
} as const;

export type ExitCode = (typeof EXIT_CODES)[keyof typeof EXIT_CODES];

type CliErrorOptions = {
  cause?: unknown;
  details?: Record<string, string>;
};

export class CliError extends Error {
  readonly code: ExitCode;
  readonly details: Record<string, string>;

  constructor(message: string, code: ExitCode, options: CliErrorOptions = {}) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause });
    this.name = "CliError";
    this.code = code;
    this.details = options.details ?? {};
  }
}

export function formatError(error: unknown): string {
  if (error instanceof CliError) {
    return formatCliError(error);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred.";
}

export function toCliError(error: unknown): CliError {
  if (error instanceof CliError) {
    return error;
  }

  if (error instanceof Error) {
    return new CliError(error.message, EXIT_CODES.UNKNOWN_FAILURE, {
      cause: error,
    });
  }

  return new CliError("An unknown error occurred.", EXIT_CODES.UNKNOWN_FAILURE, {
    details: {
      receivedType: typeof error,
    },
  });
}

export function reportErrorToStderr(error: unknown): number {
  const message = formatError(error);
  console.error(message);
  return toCliError(error).code;
}

function formatCliError(error: CliError): string {
  const detailEntries = Object.entries(error.details);

  if (detailEntries.length === 0) {
    return error.message;
  }

  return [error.message, ...detailEntries.map(([key, value]) => `${key}: ${value}`)].join("\n");
}
