// Importing required modules
var express = require("express"); // Importing Express framework
const {
  addAPlantPage, // Controller function for rendering add plant page
  addNewPlantToDb, // Controller function for adding new plant to database
  editPlantName, // Controller function for editing plant name
} = require("../controllers/addPlantController"); // Importing controller functions
const upload = require("./multer.config"); // Importing Multer configuration for file upload

var router = express.Router(); // Creating a router instance using Express

// Route to render add plant page
router.get("/", addAPlantPage);

// Route to handle adding a new plant to the database
router.post("/addNewPlant", upload.single("photo"), addNewPlantToDb);

// Route to handle editing plant name
router.put("/editPlantName/:plant_id", editPlantName);

module.exports = router; // Exporting the router for use in other files
