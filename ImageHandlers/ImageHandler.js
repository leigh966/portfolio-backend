import { v4 as uuidv4 } from "uuid";
export class ImageHandler {
  static generateFilename(file) {
    let uuid = uuidv4().toString();
    var temp_file_arr = file.originalname.split(".");
    var temp_file_extension = temp_file_arr[temp_file_arr.length - 1];
    return uuid + "." + temp_file_extension;
  }

  constructor() {
    if (this.constructor == ImageHandler) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  async save(file) {
    throw new Error("Method 'save()' must be implemented.");
  }

  async get_url(filename) {
    throw new Error("Method 'get_url()' must be implemented.");
  }
}
