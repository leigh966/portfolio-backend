import { getClient } from "./postgres_client.js";
import FileNotFoundError from "./FileNotFoundError.js";

export function standardGetAll(res, dbEntity) {
  let entityObj = new dbEntity(getClient());
  entityObj.getAll().then((output) => {
    res.status(200);
    res.send(JSON.stringify(output));
    return;
  });
}

export function standardDelete(id, res, dbEntity) {
  const entityObj = new dbEntity(client);
  entityObj.deleteById(id).then(() => {
    res.status(204);
    res.send("Done");
  });
}

export function standardInsert(json, res, dbEntity) {
  const entityObj = new dbEntity(getClient(), json);
  entityObj
    .insertThis()
    .then((success) => {
      if (success) {
        res.status(201);
        res.send("Record added");
        return;
      }
      res.status(500);
      res.send("Error writing to db");
    })
    .catch((err) => {
      if (err instanceof FileNotFoundError) {
        res.status(404);
        res.send("Image not found");
      } else {
        res.status(500);
        res.send("Unknown error checking existance of image");
        console.log(err);
      }
    });
}
