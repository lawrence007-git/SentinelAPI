"use client";

import { useEffect, useState } from "react"; 
import { apiFetch } from "@/lib/api";

type Health = { status:string };
type State = "loading" | "up" | "down";
export default function BackendStatus(){
    const [state, setState] = useState<State>("loading");

    useEffect(() => {
        apiFetch<Health>("/health")
        .then(() => setState("up"))
        .catch(() => setState("down"));
}, []);

  const styles: Record<State, string> = {
    loading: "bg-gray-200 text-gray-700",
    up: "bg-green-100 text-green-800",
    down: "bg-red-100 text-red-800",
  };
  const labels: Record<State, string> = {
    loading: "Checking backend…",
    up: "Backend is running",
    down: "Backend unreachable",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-sm font-medium ${styles[state]}`}>
      {labels[state]}
    </span>
  );
}