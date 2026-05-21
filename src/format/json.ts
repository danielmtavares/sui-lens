import type { JsonOutputEnvelope, SuiSummary } from "../api/types.js";

export function formatSummaryJson(summary: SuiSummary): string {
  const output: JsonOutputEnvelope<typeof summary.kind> = {
    data: summary,
    kind: summary.kind,
  };

  return `${JSON.stringify(output, null, 2)}\n`;
}
