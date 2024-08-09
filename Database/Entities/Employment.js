import { DatabaseEntity } from "./DatabaseEntity.js";

export class Employment extends DatabaseEntity {
  constructor(client) {
    super("employment", client);
  }
}
