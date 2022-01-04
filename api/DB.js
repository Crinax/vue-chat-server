const { openSync, closeSync, readSync } = require('fs');

class DB {
  static schemes;
  static DB_PATH = './DB';
  static status = 'ok';

  static init(tables) {
    DB.tables = tables;
    for (let table of DB.tables) {
      if (!table.name) throw new Error('Unspecified table name!');
      if (!table.scheme) throw new Error('Unspecified table scheme!');
      table = DB.createTable(table);
    }
  }

  static createTable({ name, scheme }) {
    try {
      const f = openSync(`${DB.DB_PATH}/${name}.json`, 'w');
      closeSync(f);
    } catch (err) {
      DB.status = err;
    }
  }

  static get(tableName) {
    
  }

  static post(tableName, values) {
    return [];
  }
}

module.exports = DB;