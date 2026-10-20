import BackendStatus from "./components/BackendStatus";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold">Sentinel API Monitor</h1>
      <p className="mt-2 text-gray-600">Know when your APIs break before your users do.</p>
      <div className="mt-6">
        <BackendStatus />
      </div>
    </main>
  );
}