import { restoreDangerousCharacters } from "../../validation.js";
import { DatabaseEntity } from "./DatabaseEntity.js";

export class Employment extends DatabaseEntity {
  columns = ["employer", "job_title", "start_date", "end_date"];
  constructor(client, json) {
    let values = null;
    if (json) {
      values = [json.employer, json.job_title, json.start_date, json.end_date];
    }
    super("employment", client, values);
    if (!values) return;
    this.values[2] = restoreDangerousCharacters(this.values[2]);
    this.values[3] = restoreDangerousCharacters(this.values[3]);
  }
}
