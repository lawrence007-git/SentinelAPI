"use client";

import { useEffect, useState } from "react";
import { getMonitors } from "@/lib/monitor";
import type { Monitor, MonitorStatus, TestRun } from "@/types/monitor";
import StatusBadge from "@/components/custom/StatusBadge";
import DeleteMonitorButton from "./DeleteMonitorButton";
import RunMonitorButton from "../../testruns/_components/RunMonitorButton";

import Link from "next/link";

type State =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; monitors: Monitor[] };

function formatInterval(seconds: number) {
  if (seconds % 3600 === 0) return `Every ${seconds / 3600} h`;
  if (seconds % 60 === 0) return `Every ${seconds / 60} min`;
  return `Every ${seconds} s`;
}

export default function MonitorTable() {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    getMonitors()
      .then((monitors) => setState({ kind: "ready", monitors }))
      .catch(() => setState({ kind: "error" }));
  }, []);

  if (state.kind === "loading")
    return <p className="text-muted-foreground">Loading monitors…</p>;
  if (state.kind === "error")
    return (
      <p className="text-destructive">
        Could not load monitors. Check that the backend is running.
      </p>
    );
  if (state.monitors.length === 0)
    return (
      <div className="panel p-8">
        <p className="font-medium">No monitors yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add an endpoint and Sentinel will watch it for you.
        </p>
      </div>
    );

  function handleRan(id: string, run: TestRun) {
    const status: MonitorStatus = run.passed ? "up" : "down";
    setState((current) =>
      current.kind === "ready"
        ? {
            kind: "ready",
            monitors: current.monitors.map((m) =>
              m.id === id ? { ...m, status } : m,
            ),
          }
        : current,
    );
  }
  function handleDeleted(id: string) {
    setState((current) =>
      current.kind === "ready"
        ? {
            kind: "ready",
            monitors: current.monitors.filter((m) => m.id !== id),
          }
        : current,
    );
  }

  return (
    <div className="panel overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Endpoint</th>
            <th className="px-4 py-3 font-medium">Checks</th>
            <th className="px-4 py-3 font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {state.monitors.map((m) => (
            <tr key={m.id}>
              <td className="px-4 py-3">
                <StatusBadge status={m.status} />
              </td>
              <td className="px-4 py-3 font-medium">
                <Link
                  href={`/monitors/view/${m.id}`}
                  className="hover:underline"
                >
                  {m.name}
                </Link>
              </td>
              <td className="max-w-xs truncate px-4 py-3 font-mono text-xs text-muted-foreground">
                <span className="mr-2 text-foreground">{m.method}</span>
                {m.url}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatInterval(m.intervalSeconds)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <RunMonitorButton id={m.id} onRan={handleRan} />
                  <Link href={`/monitors/edit/${m.id}`} className="btn-ghost">
                    Edit
                  </Link>
                  <DeleteMonitorButton
                    id={m.id}
                    name={m.name}
                    onDeleted={handleDeleted}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
