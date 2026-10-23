import MonitorForm from "@/components/custom/MonitorForm";

export default function NewMonitorPage() {
  return (
    <main className="mx-auto max-w-xl px-8 py-10">
      <h1 className="mb-1 font-display text-2xl font-semibold tracking-tight">New monitor</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Add an endpoint and Sentinel will watch it for you.
      </p>
      <div className="panel p-6">
        <MonitorForm />
      </div>
    </main>
  );
}