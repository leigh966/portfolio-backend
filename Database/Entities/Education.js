import { DatabaseEntity } from "./DatabaseEntity.js";

export class Education extends DatabaseEntity {
  constructor(client) {
    super("education", client);
  }
}
