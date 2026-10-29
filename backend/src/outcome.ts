export const FAILURE_REASONS = [
  "timeout",
  "connection_error",
  "unexpected_status",
  "blocked",
] as const;

export type FailureReason = (typeof FAILURE_REASONS)[number];