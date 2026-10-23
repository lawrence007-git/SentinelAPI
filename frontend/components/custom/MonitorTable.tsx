"use client";

import { useEffect, useState } from "react";
import { getMonitors } from "@/lib/monitor";
import type { Monitor } from "@/types/monitor";
import StatusBadge from "@/components/custom/StatusBadge";

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

    if (state.kind === "loading") return <p className="text-muted-foreground">Loading monitors…</p>;
    if (state.kind === "error")
      return <p className="text-destructive">Could not load monitors. Check that the backend is running.</p>;
    if (state.monitors.length === 0)
      return (
        <div className="panel p-8">
          <p className="font-medium">No monitors yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add an endpoint and Sentinel will watch it for you.
          </p>
        </div>
      );

    return (
      <div className="panel overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Endpoint</th>
              <th className="px-4 py-3 font-medium">Checks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {state.monitors.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                <td className="px-4 py-3 font-medium">{m.name}</td>
                <td className="max-w-xs truncate px-4 py-3 font-mono text-xs text-muted-foreground">
                  <span className="mr-2 text-foreground">{m.method}</span>
                  {m.url}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatInterval(m.intervalSeconds)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  )
}