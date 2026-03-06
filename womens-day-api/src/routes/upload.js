import { cloudinary } from "../lib/cloudinary.js";

export async function uploadRoutes(app) {
  app.post("/upload", async (request, reply) => {
    try {
      const data = await request.file();

      if (!data) {
        return reply.status(400).send({
          error: "Nenhum arquivo enviado"
        });
      }

      const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
      ];

      if (!allowedMimeTypes.includes(data.mimetype)) {
        return reply.status(400).send({
          error: "Formato inválido. Envie JPG, PNG ou WEBP"
        });
      }

      const fileBuffer = await data.toBuffer();

      const maxSizeInBytes = 5 * 1024 * 1024;

      if (fileBuffer.length > maxSizeInBytes) {
        return reply.status(400).send({
          error: "Arquivo muito grande. Máximo de 5MB"
        });
      }

      const base64 = fileBuffer.toString("base64");
      const dataUri = `data:${data.mimetype};base64,${base64}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "womens-day-tributes"
      });

      return reply.send({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: "Erro ao fazer upload da imagem"
      });
    }
  });
}