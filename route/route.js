const express = require("express");
const { addUser, getAllUser, getProfil } = require("../controller/user");
const { getToken, authenticateToken } = require("../controller/token");
const router = express.Router();

//Definition des routes
router.route("/register").post(addUser);

router.get("/hello", (req, res) => {
  res.send("hello");
});

router.get("/me", authenticateToken, (req, res) => {
  res.send(req.user);
});

router.route("/login").post(getToken);

router.get("/users/list", authenticateToken, (req, res) => {
  if (req.user.user.admin == true) {
    getAllUser(req, res);
  } else {
    res.status(401).send("Vous devez être admin");
  }
});

router.post("/profil", authenticateToken, (req, res) => {
  getProfil(req, res);
});

module.exports = router;
