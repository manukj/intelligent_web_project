const chatModel = require("../models/chat_model");

const mockChatMessage = [
  {
    message: "Hello",
    sender: "John",
    timestamp: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
  },
  {
    message: "How are you?",
    sender: "Mark",
    timestamp: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
  },
  {
    message: "I'm good, thanks!",
    sender: "John",
    timestamp: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
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
  // chatModel.ChatMessage.find({ plant_id: plant_id }, (err, chatMessages) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   res.json(chatMessages);
  // });
  res.json(mockChatMessage);
};

exports.addChatMessage = async (req, res, next) => {
  const plant_id = req.params.plant_id;
  const user_name = req.params.user_name;
  const message = req.body.message;
  const timestamp = new Date()
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "");

  const newChatMessage = new chatModel.ChatMessage({
    chat_message: message,
    user_name: user_name,
    chat_time: timestamp,
    plant_id: plant_id,
  });

  newChatMessage.save((err) => {
    if (err) {
      return next(err);
    }
    res.json(newChatMessage);
  });
};
