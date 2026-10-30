"use client";

import { useState } from "react";
import { runMonitor } from "@/lib/monitor";
import type { TestRun } from "@/types/monitor";
import { REASON_TEXT } from "@/lib/runtext";

function describe(run: TestRun) {
  if (run.passed) {
    return `Passed: ${run.statusCode} in ${run.durationMs ?? "?"} ms`;
  }
  const reason = run.failureReason ? REASON_TEXT[run.failureReason] : "Failed";
  return run.statusCode ? `${reason} (${run.statusCode})` : reason;
}

export default function RunMonitorButton({
  id,
  onRan,
}: {
  id: string;
  onRan: (id: string, run: TestRun) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleRun() {
    setBusy(true);
    setMessage(null);
    try {
      const run = await runMonitor(id);
      onRan(id, run);
      setMessage(describe(run));
    } catch {
      setMessage("Could not run the check.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      {message && (
        <span role="status" className="text-xs text-muted-foreground">
          {message}
        </span>
      )}
      <button
        type="button"
        className="btn-ghost"
        disabled={busy}
        onClick={handleRun}
      >
        {busy ? "Running…" : "Run"}
      </button>
    </span>
  );
}
