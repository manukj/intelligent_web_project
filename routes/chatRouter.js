var express = require("express");
const { chatPage } = require("../controllers/chatController");
var router = express.Router();

router.get("/", chatPage);

module.exports = router;
