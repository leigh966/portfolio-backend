import {
  removeDangerousCharacters,
  restoreDangerousCharacters,
} from "../../validation.js";

export class DatabaseEntity {
  constructor(tableName, dbClient, values, id) {
    this.tableName = tableName;
    this.dbClient = dbClient;
    if (!values) return;
    this.values = values.map((val) => removeDangerousCharacters(val));
    this.id = id;
  }

  async cleanupClient() {
    this.dbClient.end();
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
    this.cleanupClient();
    return output;
  }
  async insert(columns, values) {
    const colText = columns.join(",");
    const text = `INSERT INTO ${this.tableName}(${colText}) VALUES($1, $2, $3, $4) RETURNING *`;
    const dbRes = await this.dbClient.query(text, values);
    this.cleanupClient();
    return dbRes.rows.length > 0;
  }

  // do not use in super class
  async insertThis() {
    return this.insert(this.columns, this.values);
  }

  async deleteById(id) {
    const query = `DELETE FROM ${this.tableName} WHERE id=${id}`;
    await this.dbClient.query(query);
    this.cleanupClient();
  }

  async updateById(id, columns, values) {
    let query = `UPDATE ${this.tableName} SET `;
    columns.forEach((element, index) => {
      if (index > 0) query += ", ";
      query += element + "=$" + (index + 1);
    });
    query += ` WHERE id=${id} RETURNING *;`;
    console.log(query);
    const dbRes = await this.dbClient.query(query, values);
    this.cleanupClient();
    return dbRes.rows.length > 0;
  }

  async updateThis() {
    return await this.updateById(this.id, this.columns, this.values);
  }
}
