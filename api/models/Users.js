const { Schema, model } = require('mongoose');

const UsersSchema = new Schema({
  login: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  },
  password: {
    type: String,
    required: true,
  }
});

const Users = model('Users', UsersSchema);

module.exports = { UsersSchema, Users };