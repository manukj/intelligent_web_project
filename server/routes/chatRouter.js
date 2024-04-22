var express = require("express");
const {
  chatPage,
  getChatMessagesByPlantId,
} = require("../controllers/chatController");
var router = express.Router();

router.get("/room/:plant_id/:user_name", chatPage);
router.get("/getChatMessages/:plant_id", getChatMessagesByPlantId);

module.exports = router;
