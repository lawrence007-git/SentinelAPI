"use client";

import { useEffect, useState, Suspense } from "react";
import { notFound, useParams } from "next/navigation";
import { ApiError } from "@/lib/api";
import { getMonitor } from "@/lib/monitor";
import type { Monitor } from "@/types/monitor";
import FormShell from "../../../_components/FormShell";
import MonitorForm from "../../_components//MonitorForm";

type State =
  | { kind: "loading" }
  | { kind: "not-found" }
  | { kind: "error" }
  | { kind: "ready"; monitor: Monitor };

const EditMonitorContent = () => {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;

    getMonitor(id)
      .then((monitor) => {
        if (!cancelled) setState({ kind: "ready", monitor });
      })
      .catch((err) => {
        if (cancelled) return;
        const missing = err instanceof ApiError && (err.status === 404 || err.status === 400);
        setState({ kind: missing ? "not-found" : "error" });
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.kind === "loading") {
    return <div className="p-6 text-sm text-muted-foreground">Loading monitor…</div>;
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

  return (
    <FormShell
      title="Edit monitor"
      description={state.monitor.name}
      backHref="/monitors"
      backLabel="Back to monitors"
    >
      <MonitorForm monitor={state.monitor} />
    </FormShell>
  );
};

const EditMonitorPage = () => {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading monitor…</div>}>
      <EditMonitorContent />
    </Suspense>
  );
};

export default EditMonitorPage;