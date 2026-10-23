import { apiFetch } from "@/lib/api";
import type { Monitor } from "@/types/monitor";
import type { CreateMonitorInput } from "@/types/monitor";

export function getMonitors() {
  return apiFetch<Monitor[]>("/monitors");
  
}
export function createMonitor(input: CreateMonitorInput) {
  return apiFetch<Monitor>("/monitors", {
    method: "POST",
    body: JSON.stringify(input),
  });
}