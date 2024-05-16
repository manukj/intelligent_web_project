const ChatMessage = require("../models/chat_model");

// Renders the chat page for a specific user and plant based on parameters passed in the URL.
exports.chatPage = async (req, res, next) => {
  const plant_id = req.params.plant_id;
  const user_name = req.params.user_name;
  res.render("details/chat", {
    userName: user_name,
    plantId: plant_id,
  });
};

// Retrieves chat messages for a specific plant from the database.
exports.getChatMessagesByPlantId = async (req, res, next) => {
  const plant_id = req.params.plant_id;
  console.log("Getting chat messages for plant id: ", plant_id);
  return ChatMessage.find({ plant_id: plant_id })
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

// Adds a new chat message to the database.
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
    suggested_name: chatMessage.suggested_name,
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
