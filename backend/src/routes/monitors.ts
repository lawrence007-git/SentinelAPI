import type { FastifyInstance } from "fastify";
import { createMonitorSchema, updateMonitorSchema } from "../validation.js";
import { db } from "../db.js";
import {monitors} from "../schema.js";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { eq } from "drizzle-orm";

export async function monitorRoutes(app: FastifyInstance) {

    const idParamsSchema = z.object({id: z.string().uuid("Invalid monitor ID")});

    app.get("/monitors/:id", async (request, reply) => {
        const parsed = idParamsSchema.safeParse(request.params);
        if (!parsed.success) {
        return reply.status(400).send({ error: "Invalid monitor id" });
  }
    const [monitor] = await db
    .select()
    .from(monitors)
    .where(eq(monitors.id, parsed.data.id));

    if (!monitor) {
        return reply.status(404).send({ error: "Monitor not found" });
        }
        return monitor;
    });

    app.get("/monitors", async () => {
    return db.select().from(monitors).orderBy(desc(monitors.createdAt));
    });

    app.post("/monitors", async(request,reply) => {
        const parsed = createMonitorSchema.safeParse(request.body);

    if (!parsed.success) {
        return reply.status(400).send({
            error: "Validation failed",
            issues: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }

    const[create] = await db.insert(monitors).values(parsed.data).returning();
    return reply.status(201).send(create);
});

    app.patch("/monitors/:id", async (request, reply) => {
        const params = idParamsSchema.safeParse(request.params);
        if (!params.success) {
            return reply.status(400).send({ error: "Invalid monitor id" });
        }

        const body = updateMonitorSchema.safeParse(request.body);
        if (!body.success){
            return reply.status(400).send({
                error:"Validation failed",
                issues: body.error.issues.map((i) => ({
                    field: i.path.join("."),
                    message: i.message,
                })),
            });
        }
        if (Object.keys(body.data).length === 0) {
            return reply.status(400).send({ error: "No fields to update" });
        }

        const [updated] = await db
            .update(monitors)
            .set({...body.data, updatedAt: new Date() })
            .where(eq(monitors.id, params.data.id))
            .returning();

            if (!updated) {
                return reply.status(404).send({ error: "Monitor not found" });
            }
            return updated;
    });

    app.delete("/monitors/:id", async (request, reply) => {
        const parsed = idParamsSchema.safeParse(request.params);
        if (!parsed.success) {
            return reply.status(400).send({ error: "Invalid monitor id" });
        }

        const [deleted] = await db
        .delete(monitors)
        .where(eq(monitors.id, parsed.data.id))
        .returning();

        if(!deleted){
            return reply.status(404).send({ error: "Monitor not found" });
        }

        return reply.status(204).send();
    });

}

