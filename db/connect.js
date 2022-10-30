//connexion à la base de données ici
const { MongoClient } = require("mongodb");

var client = null;

const connection = async (url) => {
  if (client == null) {
    client = new MongoClient(url);
    try {
      await client.connect();
      console.log("Client successfully instantiate");
    } catch (error) {
      console.log("Unable to instanciate client");
      console.log(error);
    }
  } else {
    console.log("Client already instanced");
  }
};

function getDb() {
  return client.db("Projet1_API_DB");
}

module.exports = { connection, getDb };
