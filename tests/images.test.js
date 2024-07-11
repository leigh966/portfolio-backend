import { image_exists } from "../images";
//const image_exists = require("../images.js").image_exists;
test("image should be found", () => {
  return image_exists("5ce28752-36b5-4d06-97a7-6a107c11e2f8.jpg", null).then(
    (result) => expect(result).toBe(true)
  );
});
