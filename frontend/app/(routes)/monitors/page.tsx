import Link from "next/link";
import MonitorTable from "./_components/MonitorTable";

export default function MonitorsPage() {
  return (
    <main className="mx-auto max-w-5xl px-8 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Monitors</h1>
        <Link
          href="/monitors/create"
          className="btn-primary"        
        >
          New monitor
        </Link>
      </div>
      <MonitorTable />
    </main>
  );
}