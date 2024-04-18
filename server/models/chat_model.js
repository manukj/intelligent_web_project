class ChatMessage {
  constructor(chat_message, user_name, chat_time) {
    this.chat_message = chat_message;
    this.user_name = user_name;
    this.chat_time = chat_time;
  }
}

const mockChatMessage = [
  new ChatMessage(
    "Hello",
    "John",
    new Date().toISOString().replace(/T/, " ").replace(/\..+/, "")
  ),
  new ChatMessage(
    "How are you?",
    "Mark",
    new Date().toISOString().replace(/T/, " ").replace(/\..+/, "")
  ),
  new ChatMessage(
    "I'm good, thanks!",
    "John",
    new Date().toISOString().replace(/T/, " ").replace(/\..+/, "")
  ),
];

module.exports = {
  ChatMessage,
  mockChatMessage,
};
