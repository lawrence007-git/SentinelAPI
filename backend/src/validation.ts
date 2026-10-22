import { z } from "zod";

export const urlSchema = z
  .string()
  .trim()
  .min(1, "URL is required")
  .refine(
    (value) => {
      try {
        const parsed = new URL(value);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "URL must be a valid http or https address" }
  );

  export const methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"] as const;

  export const monitorFields = {
    name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
    url: urlSchema,
    method: z.enum(methods).default("GET"),
    headers: z.record(z.string(), z.string()).default({}), 
    body: z.string().max(10000, "Body is too long").optional().nullable().optional(),
    intervalSeconds: z.number().int().min(60).max(86400).default(300),
    timeoutMs: z.number().int().min(60).max(60000).default(10000),
    expectedStatus: z.number().int().min(100).max(599).default(200),
    enabled: z.boolean().default(true),
  };
  export const createMonitorSchema = z.object({
  name: monitorFields.name,
  url: monitorFields.url,
  method: monitorFields.method.default("GET"),
  headers: monitorFields.headers.default({}),
  body: monitorFields.body.optional(),
  intervalSeconds: monitorFields.intervalSeconds.default(300),
  timeoutMs: monitorFields.timeoutMs.default(10000),
  expectedStatus: monitorFields.expectedStatus.default(200),
  enabled: monitorFields.enabled.default(true),
});

  export const updateMonitorSchema = z.object(monitorFields).partial();
  export type UpdateMonitor = z.infer<typeof updateMonitorSchema>;

  export type CreateMonitorInput = z.infer<typeof createMonitorSchema>;

