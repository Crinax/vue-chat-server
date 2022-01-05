const DB = require('./DB');
const { JournalSchema, UsersSchema } = require('./schema');

class API {

  static init() {
    DB.init([
      {
        name: 'journal',
        schema: JournalSchema,
      },
      {
        name: 'users',
        schema: UsersSchema
      }
    ]);
    console.log('DB status initialization:', DB.status);
  }

  static async getJournal() {
    return await DB.get('journal');
  }

  static async getUsers() {
    return await DB.get('users');
  }

  static authUser({ password, login }) {
    return DB.post('users', { password, login });
  }

  static postMessage({ login, id, text }) {
    return DB.post('journal', { login, id, text });
  }
}

module.exports = API;