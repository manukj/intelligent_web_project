var express = require("express");
const { addAPlantPage } = require("../controllers/addPlantController");

var router = express.Router();

router.get("/", addAPlantPage);

module.exports = router;
