const mongoose = require('mongoose');
const md5 = require('md5');
const { Chat, Users } = require('./models');

class API {
  static connection;

  static async init() {
    API.connection = await mongoose.connect(process.env.DB_HOST);
  }

  static async getUsers() {
    return await Users.find();
  }

  static async getChat() {
    return await Chat.find().populate('user').exec();
  }

  static async auth(login, password) {
    const cryptoPass = API.getCrypt(password);
    let user = await Users.find({ login });
    let message = '';
    let authorized = false;

    if (user.length === 0) {
      user = new Users({ login, password: cryptoPass });

      try {
        await user.save();

        message = 'Registered successfully';
        authorized = true;
      } catch {
        message = 'Server error. Try later';
      }

    } else {
      if (user[0].password === cryptoPass) {
        message = 'Registered successfully';
        authorized = true;
      } else {
        message = 'Invalid password';
      }
    }

    return { authorized, login, message };
  }


  static async addMessage(login, message) {
    const writer = await Users.find({ login });
    const newMessage = new Chat({ user: writer[0]._id, message });

    await newMessage.save();

    return { ok: true };
  }

  static getCrypt(text) {
    let result = text;

    for (let i = 0; i < 2048; i++) {
      result = md5(result);
      if (i % 2 || i % 3) {
        result = result.split('').reverse().join('');
      }
    }

    return result;
  }
}

module.exports = API;
