ALTER TABLE "test-runs" RENAME TO "test_runs";--> statement-breakpoint
ALTER TABLE "test_runs" DROP CONSTRAINT "test_runs_failure_reason_check";--> statement-breakpoint
ALTER TABLE "test_runs" DROP CONSTRAINT "test_runs_outcome_check";--> statement-breakpoint
ALTER TABLE "test_runs" DROP CONSTRAINT "test_runs_status_code_check";--> statement-breakpoint
ALTER TABLE "test_runs" DROP CONSTRAINT "test-runs_monitor_id_monitors_id_fk";
--> statement-breakpoint
ALTER TABLE "test_runs" ADD CONSTRAINT "test_runs_monitor_id_monitors_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_runs" ADD CONSTRAINT "test_runs_failure_reason_check" CHECK ("test_runs"."failure_reason" IS NULL OR "test_runs"."failure_reason" IN ('timeout','connection_error','unexpected_status','blocked'));--> statement-breakpoint
ALTER TABLE "test_runs" ADD CONSTRAINT "test_runs_outcome_check" CHECK (("test_runs"."passed" AND "test_runs"."failure_reason" IS NULL AND "test_runs"."error_message" IS NULL)
        OR (NOT "test_runs"."passed" AND "test_runs"."failure_reason" IS NOT NULL));--> statement-breakpoint
ALTER TABLE "test_runs" ADD CONSTRAINT "test_runs_status_code_check" CHECK (("test_runs"."failure_reason" IS NULL OR "test_runs"."failure_reason" = 'unexpected_status')
        = ("test_runs"."status_code" IS NOT NULL));