//Fonction d'ajout ici
const { User } = require("../model/user");
const client = require("../db/connect");

const addUser = async (req, res) => {
  try {
    let user = new User(
      req.body.userName,
      req.body.email,
      req.body.firstName,
      req.body.lastName,
      req.body.password
    );

    let result = await client.getDb().collection("Users").insertOne(user);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { addUser };
