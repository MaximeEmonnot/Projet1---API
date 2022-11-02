const jwt = require("jsonwebtoken");
const { findUser } = require("./user");

const accessTokenSecret = "4232154665OAZKI";

//Récupération du token d'authentification
const getToken = async (req, res) => {
  try {
    let user = await findUser(
      req.body.userName,
      req.body.email,
      req.body.password
    );
    if (user == null) {
      res.status(401).send("Bad credential/incorect user");
    } else {
      const accessToken = generatAccesToken(user);
      res.status(200).send({ accessToken });
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

//Vérification du token d'authentification
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]; //Récupère l'autorisation sous la forme : Basic <token>
  const token = authHeader && authHeader.split(" ")[1]; // token = false si authHeader est vide sinon récupère la deuxième partie de authHeader correspondant au token

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, accessTokenSecret, (error, user) => {
    if (error) {
      console.log(error);
      return res.sendStatus(401);
    } //Vérifie si le token est valide
    req.user = user; //Ajoute les informations de l'utilisateur dans le request
    next();
  });
}

//Génère un nouveau token d'authentification
function generatAccesToken(user) {
  try {
    return jwt.sign({ user }, accessTokenSecret, {
      expiresIn: "1800s",
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getToken, authenticateToken };
