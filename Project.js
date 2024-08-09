import { DatabaseEntity } from "./DatabaseEntity.js";
export class Project extends DatabaseEntity {
  columns = ["name", "description", "tagline", "image_filename"];
  constructor(json, client) {
    super("projects", client);
    this.values = [
      json.name,
      json.description,
      json.tagline,
      json.image_filename,
    ];
  }
}
