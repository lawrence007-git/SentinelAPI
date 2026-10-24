import FormShell from "../../_components/FormShell";
import MonitorForm from "../_components/MonitorForm";

export default function NewMonitorPage() {
  return (
    <FormShell
      title="New monitor"
      description="Add an endpoint and Sentinel will watch it for you."
      backHref="/monitors"
      backLabel="Back to monitors"
    >
      <MonitorForm />
    </FormShell>
  );
}