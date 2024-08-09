import { client } from "../../aws-operations.js";
import {
  removeDangerousCharacters,
  restoreDangerousCharacters,
} from "../../validation.js";

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
  async insert(columns, values) {
    const colText = columns.join(",");
    const text = `INSERT INTO ${this.tableName}(${colText}) VALUES($1, $2, $3, $4) RETURNING *`;
    const dbRes = await this.dbClient.query(
      text,
      values.map((val) => removeDangerousCharacters(val))
    );
    return dbRes.rows.length > 0;
  }

  // do not use in super class
  async insertThis() {
    return this.insert(this.columns, this.values);
  }
}
