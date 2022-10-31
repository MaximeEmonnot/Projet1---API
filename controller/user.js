//Fonction d'ajout ici
const jwt = require("jsonwebtoken");
const { User } = require("../model/user");
const client = require("../db/connect");

const getToken = async (req, res) => {
  if (req.body.userName != null && req.body.password != null) {
    if (
      await client
        .getDb()
        .collection("Users")
        .countDocuments(
          { $and: [{ userName: userName }, { password: password }] },
          { limit: 1 }
        )
    ) {
      //creer le token
    } else {
      res.status(500).send("Bad credential/incorect user");
    }
  } else if (req.body.email != null && req.body.password != null) {
    if (
      await client
        .getDb()
        .collection("Users")
        .countDocuments(
          { $and: [{ email: email }, { password: password }] },
          { limit: 1 }
        )
    ) {
      //creer le token
    } else {
      res.status(500).send("Bad credential/incorect user");
    }
  } else {
    res.status(500).send("Bad credential/incorect user");
  }
};

const addUser = async (req, res) => {
  if (
    req.body.userName == null ||
    req.body.email == null ||
    req.body.firstName == null ||
    req.body.lastName == null ||
    req.body.password == null ||
    isUserExist(req.body.userName, req.body.email)
  ) {
    res.status(500).send("KO");
  } else {
    try {
      let user = new User(
        req.body.userName,
        req.body.email,
        req.body.firstName,
        req.body.lastName,
        req.body.password
      );

      let result = await client.getDb().collection("Users").insertOne(user);

      res.status(200).send("OK");
    } catch (error) {
      console.log(error);
      res.status(500).send("KO");
    }
  }
};

const isUserExist = async (userName, email) => {
  try {
    let result = await client
      .getDb()
      .collection("Users")
      .countDocuments(
        { $or: [{ userName: userName }, { email: email }] },
        { limit: 1 }
      );
    return result;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { addUser };
