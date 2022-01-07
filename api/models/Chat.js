const { Schema, model } = require('mongoose');

const ChatSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  },
  message: {
    type: String,
    required: true,
  }
});

const Chat = model('Chat', ChatSchema);

module.exports = { ChatSchema, Chat };