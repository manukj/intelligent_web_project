const ChatMessage = require("../models/chat_model");

exports.chatPage = async (req, res, next) => {
  const plant_id = req.params.plant_id;
  const user_name = req.params.user_name;
  res.render("details/chat", {
    userName: user_name,
    plantId: plant_id,
  });
};

exports.getChatMessagesByPlantId = async (req, res, next) => {
  const plant_id = req.params.plant_id;
  console.log("Getting chat messages for plant id: ", plant_id);
  return ChatMessage.find({})
    .then((chats) => {
      console.log(
        "Chat messages retrieved successfully! :",
        JSON.stringify(chats)
      );
      res.json(chats);
    })
    .catch((err) => {
      console.error("Error retrieving chat messages: ", err);
      res.json("Error retrieving chat messages: ");
    });
};

exports.addChatMessage = async (req, res, next) => {
  const chatMessage = req.body.chatMessage;
  const timestamp = new Date()
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "");

  const newChatMessage = new ChatMessage({
    chat_message: chatMessage.chat_message,
    user_name: chatMessage.user_name,
    chat_time: chatMessage.chat_time || timestamp,
    plant_id: chatMessage.plant_id,
  });

  console.log("Adding chat message: ", newChatMessage);
  return newChatMessage
    .save()
    .then((chat) => {
      console.log("Chat message added successfully! :", chat);
      res.json(chat);
    })
    .catch((err) => {
      console.error("Error adding chat message: ", err);
      return res.status(500).json({
        success: false,
        message: "Error fetching data",
        error: err.message, // Provides more specific error detail
      });
    });
};
