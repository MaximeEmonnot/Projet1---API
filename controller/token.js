const jwt = require("jsonwebtoken");
const { findUser } = require("./user");

const accessToken = "4232154665OAZKI";

const getToken = async (req, res) => {
  if (
    (req.body.userName == null && req.body.email == null) ||
    req.body.password == null
  ) {
    res.status(401).send("Bad credential/incorect user");
  } else {
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
  }
};

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, accessToken, (error, user) => {
    if (error) {
      console.log(error);
      return res.sendStatus(401);
    }
    req.user = user;
    next();
  });
}

function generatAccesToken(user) {
  try {
    return jwt.sign({ user }, accessToken, {
      expiresIn: "1800s",
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getToken, authenticateToken };
