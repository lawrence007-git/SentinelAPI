export type MonitorStatus = "pending" | "up" | "down";

export type Monitor = {
  id: string;
  name: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | null;
  intervalSeconds: number;
  timeoutMs: number;
  expectedStatus: number;
  enabled: boolean;
  status: MonitorStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateMonitorInput = {
  name: string;
  url: string;
  method: string;
  intervalSeconds: number;
  timeoutMs: number;
  expectedStatus: number;
};

export type FailureReason =
  | "timeout"
  | "connection_error"
  | "unexpected_status"
  | "blocked";

export type TestRun = {
  id: string;
  monitorId: string;
  startedAt: string;
  durationMs: number | null;
  statusCode: number | null;
  passed: boolean;
  failureReason: FailureReason | null;
  errorMessage: string | null;
};