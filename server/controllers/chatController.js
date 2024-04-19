const { mockChatMessage } = require("../models/chat_model");
exports.chatPage = async (req, res, next) => {
  const plant_id = req.params.plant_id;
  const user_name = req.params.user_name;
  res.render("chat/chat", {
    userName: user_name,
    plantId: plant_id,
  });
};

exports.getChatMessages = async (req, res, next) => {
  const plant_id = req.params.plant_id;
  res.json(mockChatMessage);
};
