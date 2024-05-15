var express = require("express");
const { addAPlantPage, addNewPlantToDb } = require("../controllers/addPlantController");
const upload = require('./multer.config'); // Import the multer configuration
const { editPlantName } = require("../controllers/addPlantController");

var router = express.Router();

router.get("/", addAPlantPage);

router.post("/addNewPlant", upload.single('photo'), addNewPlantToDb); // Add the multer middleware
router.put("/editPlantName/:id", editPlantName); //edit the palnt name

module.exports = router;
