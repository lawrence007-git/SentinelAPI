import type { MonitorStatus } from "@/types/monitor";

const config: Record<MonitorStatus, { label: string; dot: string }> = {
  pending: { label: "Not checked yet", dot: "bg-muted-foreground" },
  up: { label: "Up", dot: "bg-success" },
  down: { label: "Down", dot: "bg-destructive" },
};

export default function StatusBadge({ status }: { status: MonitorStatus }) {
  const { label, dot } = config[status];
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className={`h-2.5 w-2.5 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}