var express = require("express");
const { detailsPage,} = require("../controllers/detailsController");

var router = express.Router();

router.get("/:plant_id/:user_name", detailsPage);

module.exports = router;
