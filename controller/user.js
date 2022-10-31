//Fonction d'ajout ici
const { User } = require("../model/user");
const client = require("../db/connect");

const addUser = async (req, res) => {
  if (
    req.body.userName == null ||
    req.body.email == null ||
    req.body.firstName == null ||
    req.body.lastName == null ||
    req.body.password == null ||
    (await isUserExist(req.body.userName, req.body.email))
  ) {
    res.status(401).send("KO");
  } else {
    try {
      let user = new User(
        req.body.userName,
        req.body.email,
        req.body.firstName,
        req.body.lastName,
        req.body.password
      );

      await client.getDb().collection("Users").insertOne(user);

      res.status(200).send("OK");
    } catch (error) {
      console.log(error);
      res.status(500).send("KO");
    }
  }
};

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

module.exports = { addUser, findUser };
