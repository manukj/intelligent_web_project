var express = require("express");
const {
  chatPage,
  getChatMessagesByPlantId,
  addChatMessage,
} = require("../controllers/chatController");
var router = express.Router();

router.get("/room", chatPage);
router.get("/room/:plant_id/:user_name", chatPage);
router.get("/getChatMessages/:plant_id", getChatMessagesByPlantId);
router.post("/addChatMessage", addChatMessage);

module.exports = router;
