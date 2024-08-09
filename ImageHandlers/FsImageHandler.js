import { ImageHandler } from "./ImageHandler.js";
export class FsImageHandler extends ImageHandler {
  async save(file) {
    // saving is done by middleware
    return file.filename;
  }

  async get_url(filename) {
    return process.env.BACKEND_URL + ":" + process.env.PORT + "/" + filename;
  }
}
