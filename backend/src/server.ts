import Fastify from "fastify";
import cors from "@fastify/cors";

const app = Fastify({ logger: true,
});

await app.register(cors, {
    origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000"
});

app.get("/health", async () => {
    return { status: "ok" };
});

await app.listen ({port: 4000, host: "0.0.0.0"});