var express = require("express");
const {
  addAPlantPage,
  addNewPlantToDb,
} = require("../controllers/addPlantController");
const upload = require("./multer.config");

var router = express.Router();

router.get("/:user_name", addAPlantPage);

router.post("/addNewPlant", upload.single("photo"), addNewPlantToDb);

module.exports = router;
