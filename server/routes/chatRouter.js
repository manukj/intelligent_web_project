var express = require("express");
const { chatPage, getChatMessages } = require("../controllers/chatController");
var router = express.Router();

router.get("/room/:plant_id/:user_name", chatPage);
router.get("/getChatMessages/:plant_id", getChatMessages);

module.exports = router;
