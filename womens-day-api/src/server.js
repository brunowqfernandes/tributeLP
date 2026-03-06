import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import dotenv from "dotenv";
import { connectToMongo } from "./lib/mongo.js";
import { tributeRoutes } from "./routes/tributes.js";
import { uploadRoutes } from "./routes/upload.js";

dotenv.config();

const app = Fastify({
  logger: true
});

async function bootstrap() {
  try {
    await app.register(cors, {
      origin: true
    });

    await app.register(multipart);

    app.get("/health", async () => {
      return { ok: true };
    });

    await app.register(tributeRoutes, { prefix: "/api" });
    await app.register(uploadRoutes, { prefix: "/api" });

    await connectToMongo();

    const port = Number(process.env.PORT) || 3000;

    await app.listen({
      port,
      host: "0.0.0.0"
    });

    console.log(`Servidor rodando na porta ${port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

bootstrap();