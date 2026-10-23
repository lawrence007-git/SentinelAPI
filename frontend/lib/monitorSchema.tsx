import { z } from "zod";

export const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"] as const;

function isHttpUrl(value: string) {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

export const monitorFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter a name for this monitor")
    .max(100, "Use 100 characters or fewer"),
  url: z
    .string()
    .trim()
    .min(1, "Enter the endpoint URL")
    .refine(isHttpUrl, "Use a full address starting with http:// or https://"),
  method: z.enum(METHODS),
  intervalSeconds: z.number({ error: "Choose how often to check" }),
  timeoutSeconds: z
    .number({ error: "Enter the timeout in seconds" })
    .int("Use a whole number")
    .min(1, "The timeout must be at least 1 second")
    .max(60, "The timeout can't be more than 60 seconds"),
  expectedStatus: z
    .number({ error: "Enter a status code, like 200" })
    .int("Use a whole number")
    .min(100, "Status codes start at 100")
    .max(599, "Status codes end at 599"),
});

export type MonitorFormValues = z.infer<typeof monitorFormSchema>;