var express = require("express");
const { addAPlantPage,addNewPlantToDb } = require("../controllers/addPlantController");

var router = express.Router();

router.get("/", addAPlantPage);

router.post("/addNewPlant",addNewPlantToDb);

module.exports = router;
