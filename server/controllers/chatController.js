const ChatMessage = require("../models/chat_model");

const mockChatMessage = [
  {
    chat_message: "Hello",
    user_name: "John",
    chat_time: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
    plant_id: "1",
  },
  {
    chat_message: "How are you?",
    user_name: "Mark",
    chat_time: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
    plant_id: "1",
  },
  {
    chat_message: "I'm good, thanks!",
    user_name: "John",
    chat_time: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
    plant_id: "1",
  },
];

exports.chatPage = async (req, res, next) => {
  const plant_id = req.params.plant_id;
  const user_name = req.params.user_name;
  res.render("chat/chat", {
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
      res.json(null);
    });
};

exports.addChatMessage = async (req, res, next) => {
  const plant_id = req.params.plant_id;
  const user_name = req.params.user_name;
  const message = req.params.message;
  const timestamp = new Date()
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "");

  const newChatMessage = new ChatMessage({
    chat_message: message,
    user_name: user_name,
    chat_time: timestamp,
    plant_id: plant_id,
  });

  console.log("Adding chat message: ", newChatMessage);
  return newChatMessage
    .save()
    .then((chat) => {
      console.log("Chat message added successfully! :", chat);
      return JSON.stringify(chat);
    })
    .catch((err) => {
      console.error("Error adding chat message: ", err);
      return null;
    });
};
