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
export function getMonitor(id: string) {
  return apiFetch<Monitor>(`/monitors/${id}`);
}

export function updateMonitor(id: string, input: CreateMonitorInput) {
  return apiFetch<Monitor>(`/monitors/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteMonitor(id: string) {
  return apiFetch<void>(`/monitors/${id}`, { method: "DELETE" });
}