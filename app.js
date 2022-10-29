const jwt = require("jsonwebtoken");
const express = require("express");
const { connection } = require("./db/connect");
const routes = require("./route/route");
const app = express();
const dbURL =
  "mongodb+srv://benjamin:DQJ7SrXG3n9UnzDz@projet1apicluster.m9ysf1m.mongodb.net/?retryWrites=true&w=majority";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

connection(dbURL);

app.listen(3000, () => {
  console.log("Serveur waiting in the port 3000");
});
