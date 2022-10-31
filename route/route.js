const express = require("express");
const { addUser } = require("../controller/user");
const { getToken, authenticateToken } = require("../controller/token");
const router = express.Router();

router.route("/register").post(addUser);

router.get("/hello", (req, res) => {
  res.send("hello");
});

router.get("/me", authenticateToken, (req, res) => {
  res.send(req.user);
});

router.route("/login").post(getToken);

module.exports = router;
