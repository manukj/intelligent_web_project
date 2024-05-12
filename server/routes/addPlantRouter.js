var express = require("express");
const { addAPlantPage,addNewPlantToDb } = require("../controllers/addPlantController");

var router = express.Router();

router.get("/", addAPlantPage);

router.get("/addNewPlant",addNewPlantToDb);

module.exports = router;
