//Fonction d'ajout ici
const { User } = require("../model/user");
const client = require("../db/connect");

//Ajout d'un nouvel utilisateur dans la base de données
const addUser = async (req, res) => {
  try {
    if (
      !req.body.userName ||
      !req.body.email ||
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.password ||
      (await isUserExist(req.body.userName, req.body.email))
    ) {
      res.status(500).send("KO");
    } else {
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
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("KO");
  }
};

//renvoie tous les utilisateurs de la base de données
const getAllUser = async (req, res) => {
  try {
    let users = await client
      .getDb()
      .collection("Users")
      .find({})
      .project({ password: 0 })
      .toArray();
    if (users.length == 0) {
      res.status(401).send("Aucun utilisateur dans la base de données");
    } else {
      res.status(200).send(users);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

//Trouve un utilisateur dans la base de données avec son pseudo/email et mot de passe
const findUser = async (userName, email, password) => {
  try {
    if (userName && email && password) {
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
    } else if (userName && password) {
      let user = await client
        .getDb()
        .collection("Users")
        .findOne({
          $and: [{ userName: userName }, { password: password }],
        });
      return user;
    } else if (email && password) {
      let user = await client
        .getDb()
        .collection("Users")
        .findOne({
          $and: [{ email: email }, { password: password }],
        });
      return user;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

const getProfil = async (req, res) => {
  try {
    var userName = req.body.userName;
    var email = req.body.email;
    if (userName && email) {
      let users = await client
        .getDb()
        .collection("Users")
        .find({ $or: [{ userName: userName }, { email: email }] })
        .project({ _id: 0, password: 0, admin: 0 })
        .toArray();
      if (users.length == 0) {
        res.status(500).send("Aucun utilisateur trouvé");
      } else {
        res.status(200).send(users);
      }
    } else if (userName) {
      let user = await client
        .getDb()
        .collection("Users")
        .findOne(
          { userName: userName },
          { projection: { _id: 0, password: 0, admin: 0 } }
        );
      if (user == null) {
        res.status(500).send("Aucun utilisateur trouvé");
      } else {
        res.status(200).send(user);
      }
    } else if (email) {
      let user = await client
        .getDb()
        .collection("Users")
        .findOne(
          { email: email },
          { projection: { _id: 0, password: 0, admin: 0 } }
        );
      if (user == null) {
        res.status(500).send("Aucun utilisateur trouvé");
      } else {
        res.status(200).send(user);
      }
    } else {
      res.status(500).send("Aucun utilisateur trouvé");
    }
  } catch (error) {
    res.status(500);
  }
};

const removeUser = async (req, res) => {
  try {
    if (
      await client
        .getDb()
        .collection("Users")
        .countDocuments({ userName: req.body.userName }, { limit: 1 })
    ) {
      res.status(200).send("1 utilisateur supprimé");
    } else {
      res.status(500).send("Aucun utilisateur trouvé");
    }
    await client
      .getDb()
      .collection("Users")
      .deleteOne({ userName: req.body.userName });
  } catch (error) {
    console.log(error);
    res.status(500);
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

module.exports = { addUser, findUser, getAllUser, getProfil, removeUser };
