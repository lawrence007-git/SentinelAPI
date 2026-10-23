import Fastify from "fastify";
import cors from "@fastify/cors";
import { pool } from "./db.js";
import { monitorRoutes } from "./routes/monitors.js";


const app = Fastify({ logger: true,
});

await app.register(cors, {
    origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],

    
});

app.get("/health", async (request, reply) => {
    try {
    await pool.query("SELECT 1");
    return { status: "ok", database: "up" };
  } catch (err) {
    request.log.error(err);
    return reply.status(503).send({ status: "error", database: "down" });
  }
});

await app.register(monitorRoutes);
await app.listen ({port: 4000, host: "0.0.0.0"});