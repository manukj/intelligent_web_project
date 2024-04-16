class ChatMessage {
  constructor(chat_message, user_name, chat_time) {
    this.chat_message = chat_message;
    this.user_name = user_name;
    this.chat_time = chat_time;
  }
}

const mockChatMessage = [
  new ChatMessage("Hello", "John", new Date()),
  new ChatMessage("How are you?", "Alice", new Date()),
  new ChatMessage("I'm good, thanks!", "John", new Date()),
];

module.exports = {
  ChatMessage,
  mockChatMessage,
};
