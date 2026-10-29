CREATE TABLE "test_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"monitor_id" uuid NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"duration_ms" integer,
	"status_code" integer,
	"passed" boolean NOT NULL,
	"failure_reason" text,
	"error_message" text,
	CONSTRAINT "test_runs_failure_reason_check" CHECK ("test-runs"."failure_reason" IS NULL OR "test-runs"."failure_reason" IN ('timeout','connection_error','unexpected_status','blocked')),
	CONSTRAINT "test_runs_outcome_check" CHECK (("test-runs"."passed" AND "test-runs"."failure_reason" IS NULL AND "test-runs"."error_message" IS NULL)
        OR (NOT "test-runs"."passed" AND "test-runs"."failure_reason" IS NOT NULL)),
	CONSTRAINT "test_runs_status_code_check" CHECK (("test-runs"."failure_reason" IS NULL OR "test-runs"."failure_reason" = 'unexpected_status')
        = ("test-runs"."status_code" IS NOT NULL))
);
--> statement-breakpoint
ALTER TABLE "test-runs" ADD CONSTRAINT "test-runs_monitor_id_monitors_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "test_runs_monitor_started_idx" ON "test-runs" USING btree ("monitor_id","started_at" DESC NULLS LAST);