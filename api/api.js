const mongoose = require('mongoose');
const { Chat, Users } = require('./models');
const md5 = require('crypto-js/md5');

class API {
  static connection;

  async static init() {
    API.connection = await mongoose.connect(process.env.DB_HOST);
  }

  async static getUsers() {
    return await Users.find();
  }

  async static getChat() {
    return await Chat.find().populate('user').exec();
  }

  async static auth(login, password) {
    let user = await Users.find({ login, password: API.getCrypt(password) });

    if (user.length === 0) {
      user = new Users(login, API.getCrypt(password));
     
      await user.save();
    }

    return { authorized: true, login: login };
  }
  
  // TODO Add message crypto
  async static addMessage(login, message) {
    const message = new Chat({ login, message });
    
    await message.save();
    
    const allMessages = await API.getChat();

    return { messages: allMessages };
  }

  static getCrypt(text) {
    let result = text;

    for (let i = 0; i < 2042; i++) {
      result = md5(result);
      if (i % 2 || i % 3) {
        result = result.split().reverse().join('');
      }
    }
  }
}

module.exports = API;