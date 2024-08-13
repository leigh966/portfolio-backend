import { DatabaseEntity } from "./DatabaseEntity.js";
import { image_exists } from "../../images.js";
import FileNotFoundError from "../../FileNotFoundError.js";

export class Project extends DatabaseEntity {
  columns = ["name", "description", "tagline", "image_filename"];
  constructor(client, json, id) {
    let values = null;
    if (json) {
      values = [json.name, json.description, json.tagline, json.image_filename];
    }
    super("projects", client, values, id);
  }
  async confirmImageExistence(callbackTrue, callbackNull) {
    const image_filename = this.values[3];
    if (image_filename != null && image_filename != "") {
      const exists = await image_exists(image_filename);
      if (exists) {
        return callbackTrue();
      } else {
        throw new FileNotFoundError("Could not find file " + this.values[3]);
      }
    }
    return callbackNull();
  }

  async insertThis() {
    return this.confirmImageExistence(
      () => super.insertThis(),
      () => super.insertThis()
    );
  }
  async updateThis() {
    return this.confirmImageExistence(
      () => super.updateThis(),
      () =>
        super.updateById(
          this.id,
          this.columns.slice(0, -1),
          this.values.slice(0, -1)
        )
    );
  }
}
