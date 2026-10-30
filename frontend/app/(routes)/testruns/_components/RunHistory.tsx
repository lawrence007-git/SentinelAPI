import type { TestRun } from "@/types/monitor";
import { REASON_TEXT } from "@/lib/runtext";

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString();
}

export default function RunHistory({ runs }: { runs: TestRun[] }) {
  if (runs.length === 0) {
    return (
      <div className="panel p-8">
        <p className="font-medium">No checks yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Click Run to check this monitor now.
        </p>
      </div>
    );
  }

  return (
    <div className="panel overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Result</th>
            <th className="px-4 py-3 font-medium">Status code</th>
            <th className="px-4 py-3 font-medium">Response time</th>
            <th className="px-4 py-3 font-medium">When</th>
            <th className="px-4 py-3 font-medium">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {runs.map((run) => (
            <tr key={run.id}>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${run.passed ? "bg-success" : "bg-destructive"}`}
                    aria-hidden="true"
                  />
                  {run.passed
                    ? "Passed"
                    : run.failureReason
                      ? REASON_TEXT[run.failureReason]
                      : "Failed"}
                </span>
              </td>
              <td className="px-4 py-3">{run.statusCode ?? "–"}</td>
              <td className="px-4 py-3">
                {run.durationMs !== null ? `${run.durationMs} ms` : "–"}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatWhen(run.startedAt)}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {run.errorMessage ?? ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
