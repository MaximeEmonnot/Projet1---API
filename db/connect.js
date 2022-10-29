//connexion à la base de données ici
const { MongoClient } = require("mongodb");

var client = null;

function connection(url) {
  if (client == null) {
    client = new MongoClient(url);
    client.connect();
  }
}

function getDb() {
  return client.db("Projet1_API_DB");
}

module.exports = { connection, getDb };
