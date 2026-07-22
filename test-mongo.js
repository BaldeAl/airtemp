// test-mongo.js
require("dotenv").config();

const { MongoClient } = require("mongodb");

(async () => {
  const uri = process.env.DATABASE_URL;

  if (!uri) {
    console.error("DATABASE_URL est introuvable. Vérifie ton fichier .env.");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("OK - connexion MongoDB réussie");
  } catch (e) {
    console.error("Erreur MongoDB :", e);
  } finally {
    await client.close();
  }
})();
