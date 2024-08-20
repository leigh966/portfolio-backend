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
  const entityObj = new dbEntity(getClient());
  entityObj.deleteById(id).then(() => {
    res.status(204);
    res.send("Done");
  });
}

function attemptAlteringMethod(method, res, successMessage) {
  method()
    .then((success) => {
      if (success) {
        res.status(201);
        res.send(successMessage);
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
        res.send("Unknown error");
        console.log(err);
      }
    });
}

export function standardInsert(json, res, dbEntity) {
  const entityObj = new dbEntity(getClient(), json);
  attemptAlteringMethod(() => entityObj.insertThis(), res, "Record Added");
}

export function standardUpdate(id, json, res, dbEntity) {
  const entityObj = new dbEntity(getClient(), json, id);
  attemptAlteringMethod(() => entityObj.updateThis(), res, "Record Updated");
}
