import { restoreDangerousCharacters } from "../../validation.js";
import { DatabaseEntity } from "./DatabaseEntity.js";

export class Education extends DatabaseEntity {
  columns = ["school", "course", "start_date", "end_date"];
  constructor(client, json) {
    let values = null;
    if (json) {
      values = [json.school, json.course, json.start_date, json.end_date];
    }
    super("education", client, values);
    if (!values) return;
    this.values[2] = restoreDangerousCharacters(this.values[2]);
    this.values[3] = restoreDangerousCharacters(this.values[3]);
  }
}
