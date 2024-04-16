const { mockChatMessage } = require("../models/chat_model");
exports.chatPage = async (req, res, next) => {
  res.render("chat/chat", {
    chatMessages: mockChatMessage,
    user_name: "John",
  });
};
