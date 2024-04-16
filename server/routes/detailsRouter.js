var express = require("express");
const { detailsPage } = require("../controllers/detailsController");

var router = express.Router();

router.get("/", detailsPage);

module.exports = router;
