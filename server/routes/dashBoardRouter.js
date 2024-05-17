// Import the required modules
var express = require("express");
const { dashboardPage, getAllPlantDetails } = require("../controllers/dashBoardController");

// Create a new router object
var router = express.Router();

// Route for rendering the dashboard page
router.get("/", dashboardPage);

// Route for retrieving all plant details
router.get("/getAllPlantDetails", getAllPlantDetails);

// Export the router to be used in other parts of the application
module.exports = router;
