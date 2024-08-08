import { restoreDangerousCharacters } from "./validation.js";

export class DatabaseEntity {
  constructor(tableName, dbClient) {
    this.tableName = tableName;
    this.dbClient = dbClient;
  }
  async getAll() {
    let dbResponse = await this.dbClient.query(
      `SELECT * FROM ${this.tableName};`
    );
    console.log(dbResponse.rows);
    let output = [];
    for (let index = 0; index < dbResponse.rows.length; index++) {
      let outputRow = {};
      console.log(index);
      for (const [key, value] of Object.entries(dbResponse.rows[index])) {
        console.log(key + ", " + value);
        outputRow[key] = restoreDangerousCharacters(value);
      }
      output.push(outputRow);
    }
    return output;
  }
}
