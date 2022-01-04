const DB = require('./DB');
// const encryptFunc = require('./crypto');

const JournalScheme = {
  id: {
    type: Number,
    autoIncrement: true,
  },
  login: String,
  message: String,
}

const UsersScheme = {
  id: {
    type: Number,
    autoIncrement: true,
    ref: 'journal',
  },
  login: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    // encryption: encryptFunc,
  }
}

class API {

  static init() {
    DB.init([
      {
        name: 'journal',
        scheme: JournalScheme,
      },
      {
        name: 'users',
        scheme: UsersScheme
      }
    ]);
    console.log('DB status initialization:', DB.status);
  }

  static getJournal() {
    return DB.get('journal');
  }

  static authUser({ password, login }) {
    return DB.post('users', { password, login });
  }

  static postMessage({ login, id, text }) {
    return DB.post('journal', { login, id, text });
  }
}

module.exports = API;