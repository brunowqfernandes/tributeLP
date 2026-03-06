import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI não definida no .env");
}

const client = new MongoClient(uri);

let dbInstance = null;

export async function connectToMongo() {
  if (dbInstance) return dbInstance;

  await client.connect();
  dbInstance = client.db();
  console.log("Mongo conectado com sucesso");

  return dbInstance;
}

export async function getCollection(name) {
  const db = await connectToMongo();
  return db.collection(name);
}