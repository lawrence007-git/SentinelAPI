import type { MonitorStatus } from "@/types/monitor";

const styles: Record<MonitorStatus, string> = {
  pending: "bg-gray-200 text-gray-700",
  up: "bg-green-100 text-green-800",
  down: "bg-red-100 text-red-800",
};

export default function StatusBadge({ status }: { status: MonitorStatus }) {
  return (
    <span className={`rounded-full px-3 py-1 text-sm font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}