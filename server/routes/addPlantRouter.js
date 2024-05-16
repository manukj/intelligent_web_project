var express = require("express");
const {
  addAPlantPage,
  addNewPlantToDb,
  editPlantName,
} = require("../controllers/addPlantController");
const upload = require("./multer.config");

var router = express.Router();

router.get("/:user_name", addAPlantPage);

router.post("/addNewPlant", upload.single("photo"), addNewPlantToDb);

router.put("/editPlantName/:plant_id", editPlantName);

module.exports = router;
