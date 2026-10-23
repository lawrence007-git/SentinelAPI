"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { METHODS, monitorFormSchema, type MonitorFormValues } from "@/lib/monitorSchema";
import { createMonitor } from "@/lib/monitor";

import { ApiError } from "@/lib/api";

const INTERVALS = [
  { label: "Every minute", seconds: 60 },
  { label: "Every 5 minutes", seconds: 300 },
  { label: "Every 15 minutes", seconds: 900 },
  { label: "Every 30 minutes", seconds: 1800 },
  { label: "Every hour", seconds: 3600 },
];

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function MonitorForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MonitorFormValues>({
    resolver: zodResolver(monitorFormSchema),
    defaultValues: {
      name: "",
      url: "",
      method: "GET",
      intervalSeconds: 300,
      timeoutSeconds: 10,
      expectedStatus: 200,
    },
  });

  async function onSubmit(values: MonitorFormValues) {
    setServerError(null);
    try {
      await createMonitor({
        name: values.name,
        url: values.url,
        method: values.method,
        intervalSeconds: values.intervalSeconds,
        timeoutMs: values.timeoutSeconds * 1000,
        expectedStatus: values.expectedStatus,
      });
      router.push("/monitors");
    } catch (err) {
    if (err instanceof ApiError && err.status === 400) {
        setServerError("The server rejected some of these values. Check them and try again.");
    } else {
        setServerError("Could not reach the server. Check that the backend is running, then try again.");
    }
    }
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Field label="Name" htmlFor="name" error={errors.name?.message}>
        <input id="name" className="field" placeholder="Products API" {...register("name")} />
      </Field>

      <Field
        label="Endpoint URL"
        htmlFor="url"
        error={errors.url?.message}
        hint="The full address, including http:// or https://"
      >
        <input
          id="url"
          className="field font-mono"
          placeholder="https://api.example.com/products"
          {...register("url")}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Method" htmlFor="method" error={errors.method?.message}>
          <select id="method" className="field" {...register("method")}>
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Check frequency" htmlFor="intervalSeconds" error={errors.intervalSeconds?.message}>
          <select
            id="intervalSeconds"
            className="field"
            {...register("intervalSeconds", { valueAsNumber: true })}
          >
            {INTERVALS.map((i) => (
              <option key={i.seconds} value={i.seconds}>
                {i.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Timeout (seconds)"
          htmlFor="timeoutSeconds"
          error={errors.timeoutSeconds?.message}
          hint="How long to wait before counting the check as failed"
        >
          <input
            id="timeoutSeconds"
            type="number"
            className="field"
            {...register("timeoutSeconds", { valueAsNumber: true })}
          />
        </Field>

        <Field
          label="Expected status code"
          htmlFor="expectedStatus"
          error={errors.expectedStatus?.message}
          hint="The response code that means healthy, usually 200"
        >
          <input
            id="expectedStatus"
            type="number"
            className="field"
            {...register("expectedStatus", { valueAsNumber: true })}
          />
        </Field>
      </div>

      {serverError && (
        <p className="text-sm text-destructive" role="alert">
          {serverError}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save monitor"}
        </button>
        <Link href="/monitors" className="btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}