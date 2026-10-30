"use client";

import { useState, useEffect } from "react";
import { deleteMonitor } from "@/lib/monitor";

export default function DeleteMonitorButton({
  id,
  name,
  onDeleted,
}: {
  id: string;
  name: string;
  onDeleted: (id: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close modal on pressing the 'Escape' key
  useEffect(() => {
    if (!confirming) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !busy) {
        setConfirming(false);
        setError(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [confirming, busy]);

  async function handleDelete() {
    setBusy(true);
    setError(null);
    try {
      await deleteMonitor(id);
      setConfirming(false);
      onDeleted(id);
    } catch {
      setError("Failed to delete monitor. Please try again.");
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn-ghost text-destructive hover:bg-destructive/10 transition-colors"
        aria-label={`Delete ${name}`}
        onClick={() => setConfirming(true)}
      >
        Delete
      </button>

      {confirming && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => {
            if (!busy) {
              setConfirming(false);
              setError(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-monitor-title"
            aria-describedby="delete-monitor-desc"
            className="panel w-full max-w-sm p-6 text-center space-y-5 shadow-2xl border border-border bg-background rounded-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Centered Icon Header */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.75}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>

            {/* Centered Clean Copy */}
            <div className="space-y-2">
              <h3
                id="delete-monitor-title"
                className="text-lg font-semibold text-foreground"
              >
                Delete monitor?
              </h3>
              <p
                id="delete-monitor-desc"
                className="text-sm text-muted-foreground leading-relaxed"
              >
                Are you sure you want to delete{" "}
                <span className="font-semibold whitespace-per-line text-foreground">
                  {name}
                </span>
                ?
                <br /> This action cannot be undone.
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive font-medium">
                {error}
              </div>
            )}

            {/* Centered Full-Width Actions */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                className="btn-ghost w-full justify-center rounded-xl py-2.5 text-sm font-medium text-muted-foreground border border-border hover:text-foreground transition-colors"
                disabled={busy}
                onClick={() => {
                  setConfirming(false);
                  setError(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-xl bg-destructive py-2.5 text-sm font-medium text-destructive-foreground shadow-sm hover:bg-destructive/90 transition-colors disabled:opacity-50"
                disabled={busy}
                onClick={handleDelete}
              >
                {busy ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
