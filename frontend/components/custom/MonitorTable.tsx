"use client";

import { useEffect, useState } from "react";
import { getMonitors } from "@/lib/monitor";
import type { Monitor } from "@/types/monitor";
import StatusBadge from "@/components/custom/StatusBadge";

type State =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; monitors: Monitor[] };

export default function MonitorTable() {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    getMonitors()
      .then((monitors) => setState({ kind: "ready", monitors }))
      .catch(() => setState({ kind: "error" }));
  }, []);

  if (state.kind === "loading") return <p>Loading monitors…</p>;
  if (state.kind === "error") return <p className="text-red-700">Could not load monitors.</p>;
  if (state.monitors.length === 0) return <p>No monitors yet.</p>;

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b">
          <th className="py-2">Status</th>
          <th>Name</th>
          <th>URL</th>
          <th>Method</th>
          <th>Interval</th>
        </tr>
      </thead>
      <tbody>
        {state.monitors.map((m) => (
          <tr key={m.id} className="border-b">
            <td className="py-2"><StatusBadge status={m.status} /></td>
            <td>{m.name}</td>
            <td className="truncate max-w-xs">{m.url}</td>
            <td>{m.method}</td>
            <td>{m.intervalSeconds}s</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}