const express = require("express");
const { connection } = require("./db/connect");
const routes = require("./route/route");
const app = express();
const upload = require("express-fileupload");
const dbURL =
  "mongodb+srv://benjamin:DQJ7SrXG3n9UnzDz@projet1apicluster.m9ysf1m.mongodb.net/?retryWrites=true&w=majority";

//Express middleware permettant de convertir le body des requêtes entrantes en json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(upload());

//Permets d'utiliser les routes définies dans route.js
app.use(routes);

//Connexion à la base de données
connection(dbURL);

//Ecoute les connexions entrantes sur le port 3000
app.listen(3000, () => {
  console.log("Serveur waiting in the port 3000");
});
