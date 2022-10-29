const express = require("express");
const { addUser } = require("../controller/user");
const router = express.Router();

router.route("/register").post(addUser);

router.get("/hello", (req, res) => {
  res.send("hello");
});

module.exports = router;
