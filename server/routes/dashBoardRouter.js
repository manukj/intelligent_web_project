var express = require("express");
const { dashboardPage } = require("../controllers/dashBoardController");
const { getAllPlantDetails } = require("../controllers/dashBoardController");
var router = express.Router();

router.get("/", dashboardPage);

router.get("/getAllPlantDetails",getAllPlantDetails);
module.exports = router;
