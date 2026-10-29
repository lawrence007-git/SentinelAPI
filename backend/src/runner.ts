import type { FailureReason } from "./outcome.js";
import { assertSafeUrl } from "./safety.js";

export type RunnableMonitor = {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | null;
  timeoutMs: number;
  expectedStatus: number;
};

export type CheckOutcome =
  | { passed: true; statusCode: number; durationMs: number }
  | {
      passed: false;
      failureReason: FailureReason;
      statusCode: number | null;
      durationMs: number | null;
      errorMessage: string;
    };

function describeNetworkError(err: unknown): string {
  if (err instanceof Error) {
    const cause = (err as { cause?: { code?: string; message?: string } }).cause;
    return cause?.code ?? cause?.message ?? err.message;
  }
  return "Unknown error";
}
export async function runCheck(monitor: RunnableMonitor): Promise<CheckOutcome> {
  const safety = await assertSafeUrl(monitor.url);
  if (!safety.ok) {
    return {
      passed: false,
      failureReason: "blocked",
      statusCode: null,
      durationMs: null,
      errorMessage: safety.message,
    };
  }

  const sendsBody =
    monitor.body !== null && monitor.method !== "GET" && monitor.method !== "HEAD";
  const started = performance.now();
  let response: Response;

  try {
    response = await fetch(monitor.url, {
      method: monitor.method,
      headers: monitor.headers,
      body: sendsBody ? monitor.body : undefined,
      redirect: "manual",
      signal: AbortSignal.timeout(monitor.timeoutMs),
    });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      return {
        passed: false,
        failureReason: "timeout",
        statusCode: null,
        durationMs: null,
        errorMessage: `No response within ${monitor.timeoutMs / 1000} seconds`,
      };
    }
    return {
      passed: false,
      failureReason: "connection_error",
      statusCode: null,
      durationMs: null,
      errorMessage: describeNetworkError(err),
    };
  }

  const durationMs = Math.round(performance.now() - started);
  await response.body?.cancel();

  if (response.status === monitor.expectedStatus) {
    return { passed: true, statusCode: response.status, durationMs };
  }
  return {
    passed: false,
    failureReason: "unexpected_status",
    statusCode: response.status,
    durationMs,
    errorMessage: `Expected ${monitor.expectedStatus} but got ${response.status}`,
  };
}