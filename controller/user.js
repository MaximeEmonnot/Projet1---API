//Fonction d'ajout ici
const { User } = require("../model/user");
const client = require("../db/connect");

//Ajout d'un nouvel utilisateur dans la base de données
const addUser = async (req, res) => {
  try {
    var userAlreadyExist = await isUserExist(req.body.userName, req.body.email);
  } catch (error) {
    res.status(401).send("KO");
    console.log(error);
  }
  if (
    req.body.userName == null ||
    req.body.email == null ||
    req.body.firstName == null ||
    req.body.lastName == null ||
    req.body.password == null ||
    userAlreadyExist
  ) {
    res.status(401).send("KO");
  } else {
    try {
      let user = new User(
        req.body.userName,
        req.body.email,
        req.body.firstName,
        req.body.lastName,
        req.body.password,
        false
      );

      await client.getDb().collection("Users").insertOne(user);

      res.status(200).send("OK");
    } catch (error) {
      console.log(error);
      res.status(500).send("KO");
    }
  }
};

//Trouve un utilisateur dans la base de données avec son pseudo/email et mot de passe
const findUser = async (userName, email, password) => {
  if (userName != null && email != null && password != null) {
    try {
      let user = await client
        .getDb()
        .collection("Users")
        .findOne({
          $and: [
            { $or: [{ userName: userName }, { email: email }] },
            { password: password },
          ],
        });
      return user;
    } catch (error) {
      throw error;
    }
  } else if (userName != null && password != null) {
    try {
      let user = await client
        .getDb()
        .collection("Users")
        .findOne({
          $and: [{ userName: userName }, { password: password }],
        });
      return user;
    } catch (error) {
      throw error;
    }
  } else if (email != null && password != null) {
    try {
      let user = await client
        .getDb()
        .collection("Users")
        .findOne({
          $and: [{ email: email }, { password: password }],
        });
      return user;
    } catch (error) {
      throw error;
    }
  } else {
    return null;
  }
};

//Regarde si un utilisateur avec le pseudo ou l'email passé en paramètre existe dans la base de données
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
    throw error;
  }
};

module.exports = { addUser, findUser };
