let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let ChatSchema = new Schema({
  chat_message: { type: String, required: true },
  user_name: { type: String, required: true },
  chat_time: { type: Date, required: true },
  plant_id: { type: String, required: true },
});

// Configure the 'toObject' option for the schema to include getters
// and virtuals when converting to an object
ChatSchema.set("toObject", { getters: true, virtuals: true });

// Create the mongoose model 'todo' based on the defined schema
let ChatMessage = mongoose.model("chatMessages", ChatSchema);

module.exports = {
  ChatMessage,
};
