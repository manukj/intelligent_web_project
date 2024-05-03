var express = require("express");
const { detailsPage, savePlant} = require("../controllers/detailsController");
const plantModel = require("../models/plant");
var router = express.Router();

router.get("/:plant_id/:user_name", detailsPage);

router.post('/save', savePlant);

module.exports = router;
