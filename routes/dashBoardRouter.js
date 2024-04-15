var express = require("express");
const { dashboardPage } = require("../controllers/dashBoardController");
var router = express.Router();

router.get("/", dashboardPage);

module.exports = router;
