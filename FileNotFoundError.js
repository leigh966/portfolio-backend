export default class FileNotFoundError extends Error {
  constructor(message, location) {
    super(message);
    this.location = location;
  }
}
