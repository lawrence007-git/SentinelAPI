import { apiFetch } from "@/lib/api";
import type { Monitor, CreateMonitorInput, TestRun } from "@/types/monitor";


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

export function runMonitor(id: string) {
  return apiFetch<TestRun>(`/monitors/${id}/run`, { method: "POST" });
}

export function getRuns(id: string) {
  return apiFetch<TestRun[]>(`/monitors/${id}/runs`);
}