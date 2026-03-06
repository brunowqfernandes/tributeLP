import { ObjectId } from "mongodb";
import { getCollection } from "../lib/mongo.js";
import { createSlug } from "../utils/createSlug.js";
import { validateTributePayload } from "../utils/validateTributePayload.js";

export async function tributeRoutes(app) {
  app.post("/tributes", async (request, reply) => {
    try {
      const payload = request.body || {};
      const { valid, errors } = validateTributePayload(payload);

      if (!valid) {
        return reply.status(400).send({
          error: "Dados inválidos",
          details: errors
        });
      }

      const {
        email,
        name,
        subtitle = "",
        message = "",
        signature = "",
        photos = []
      } = payload;

      const slug = createSlug(name);
      const now = new Date();
      const expiresAt = new Date("2026-03-10T23:59:59.999Z");

      const tribute = {
        email,
        name,
        subtitle,
        message,
        signature,
        photos,
        status: "pending",
        slug,
        stripeSessionId: null,
        paidAt: null,
        publishedUrl: "",
        zipUrl: "",
        expiresAt,
        createdAt: now,
        updatedAt: now
      };

      const tributes = await getCollection("tributes");
      const result = await tributes.insertOne(tribute);

      return reply.status(201).send({
        id: result.insertedId,
        slug,
        status: tribute.status
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Erro ao criar homenagem" });
    }
  });

  app.get("/tributes/:slug", async (request, reply) => {
    try {
      const { slug } = request.params;

      const tributes = await getCollection("tributes");
      const tribute = await tributes.findOne(
        { slug },
        { projection: { _id: 0 } }
      );

      if (!tribute) {
        return reply.status(404).send({ error: "Homenagem não encontrada" });
      }

      return reply.send(tribute);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Erro ao buscar homenagem" });
    }
  });

  app.put("/tributes/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      const payload = request.body || {};

      const tributeUpdate = {};
      const allowedFields = ["email", "name", "subtitle", "message", "signature", "photos"];

      for (const field of allowedFields) {
        if (field in payload) {
          tributeUpdate[field] = payload[field];
        }
      }

      if (tributeUpdate.name) {
        tributeUpdate.slug = createSlug(tributeUpdate.name);
      }

      tributeUpdate.updatedAt = new Date();

      const tributes = await getCollection("tributes");

      const result = await tributes.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: tributeUpdate },
        { returnDocument: "after" }
      );

      if (!result) {
        return reply.status(404).send({ error: "Homenagem não encontrada" });
      }

      return reply.send({
        message: "Homenagem atualizada com sucesso"
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Erro ao atualizar homenagem" });
    }
  });

  app.patch("/tributes/:id/status", async (request, reply) => {
    try {
      const { id } = request.params;
      const { status } = request.body || {};

      if (!["pending", "paid"].includes(status)) {
        return reply.status(400).send({
          error: "status inválido"
        });
      }

      const update = {
        status,
        updatedAt: new Date()
      };

      if (status === "paid") {
        update.paidAt = new Date();
      }

      const tributes = await getCollection("tributes");

      const result = await tributes.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: update },
        { returnDocument: "after" }
      );

      if (!result) {
        return reply.status(404).send({ error: "Homenagem não encontrada" });
      }

      return reply.send({
        message: "Status atualizado com sucesso",
        status
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Erro ao atualizar status" });
    }
  });
}