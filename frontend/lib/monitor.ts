import { apiFetch } from "@/lib/api";
import type { Monitor } from "@/types/monitor";

export function getMonitors() {
  return apiFetch<Monitor[]>("/monitors");
}