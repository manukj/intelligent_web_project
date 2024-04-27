var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  res.render("error/no_connection");
});

module.exports = router;
