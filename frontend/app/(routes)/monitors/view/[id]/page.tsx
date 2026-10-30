"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ApiError } from "@/lib/api";
import { getMonitor, getRuns } from "@/lib/monitor";
import type { Monitor, TestRun } from "@/types/monitor";
import StatusBadge from "@/components/custom/StatusBadge";
import RunMonitorButton from "../../../testruns/_components/RunMonitorButton";
import RunHistory from "../../../testruns/_components/RunHistory";

type State =
  | { kind: "loading" }
  | { kind: "not-found" }
  | { kind: "error" }
  | { kind: "ready"; monitor: Monitor; runs: TestRun[] };

const MonitorDetailContent = () => {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;

    Promise.all([getMonitor(id), getRuns(id)])
      .then(([monitor, runs]) => {
        if (!cancelled) setState({ kind: "ready", monitor, runs });
      })
      .catch((err) => {
        if (cancelled) return;
        const missing =
          err instanceof ApiError && (err.status === 404 || err.status === 400);
        setState({ kind: missing ? "not-found" : "error" });
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  function handleRan(_id: string, run: TestRun) {
    setState((current) =>
      current.kind === "ready"
        ? {
            ...current,
            monitor: { ...current.monitor, status: run.passed ? "up" : "down" },
            runs: [run, ...current.runs].slice(0, 50),
          }
        : current,
    );
  }

  if (state.kind === "loading") {
    return (
      <div className="p-6 text-sm text-muted-foreground">Loading monitor…</div>
    );
  }
  if (state.kind === "not-found") {
    notFound();
  }
  if (state.kind === "error") {
    return (
      <div className="p-6 text-sm text-destructive">
        Could not load this monitor. Check that the backend is running.
      </div>
    );
  }

  const { monitor, runs } = state;

  return (
    <main className="mx-auto max-w-5xl px-8 py-10">
      <Link
        href="/monitors"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        Back to monitors
      </Link>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="mb-6 mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              {monitor.name}
            </h1>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              <span className="mr-2 text-foreground">{monitor.method}</span>
              {monitor.url}
            </p>
            <div className="mt-3">
              <StatusBadge status={monitor.status} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RunMonitorButton id={monitor.id} onRan={handleRan} />
            <Link href={`/monitors/edit/${monitor.id}`} className="btn-ghost">
              Edit
            </Link>
          </div>
        </div>
      </Suspense>
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">
        Recent checks
      </h2>
      <RunHistory runs={runs} />
    </main>
  );
};

export default function MonitorDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-sm text-muted-foreground">
          Loading monitor...
        </div>
      }
    >
      <MonitorDetailContent />
    </Suspense>
  );
}
