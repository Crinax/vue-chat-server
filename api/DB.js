const { open } = require('fs/promises')
const { normalize } = require('path')

class DB {
  static tables;
  static DB_PATH = normalize(`${__dirname}/../DB`);
  static status = 'ok';

  static init(tables) {
    DB.tables = tables;
    for (let table of DB.tables) {
      if (!table.name) throw new Error('Unspecified table name!');
      if (!table.schema) throw new Error('Unspecified table schema!');

      table = DB.createTable(table);

      if (DB.status !== 'ok') throw new Error(DB.status);
    }
  }

  static async createTable({ name }) {
    let file;
    try {
      file = await open(`${DB.DB_PATH}/${name}.json`, 'r');
    } catch (err) {
      try {
        file = await open(`${DB.DB_PATH}/${name}.json`, 'w');
      } catch (err) {
        DB.status = err;
      }
    } finally {
      await file?.close();
    }
  }
  // TODO: Add cheme checker and compare table&scheme (or some ways add Model :) )
  static async compare(table, schema) {
    for (let prop)
  }

  static async get(tableName) {
    let table;
    let result;
    const schema = _.find(DB.tables, ['name', tableName]);

    if (schema === undefined) throw new Error('Table not found!');

    try {
      table = await open(`${DB.DB_PATH}/${tableName}.json`, 'r');
      result = await table.readFile();
      result = result.toString();
      result = JSON.parse(result);

      DB.compare(result, schema);

      return {
        status: DB.status,
        message: 'ok',
        data: result,
      };
    } catch(err) {
      console.log(err);
      DB.status = err;
    } finally {
      await table?.close();
    }

    return {
      status: 'err',
      message: DB.status?.message,
      data: DB.status,
    }
  }

  static async post(tableName, values) {
    
  }
}

module.exports = DB;