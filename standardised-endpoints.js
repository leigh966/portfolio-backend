import { getClient } from "./postgres_client.js";
export function standardGetAll(res, dbEntity) {
  let entityObj = new dbEntity(getClient());
  entityObj.getAll().then((output) => {
    res.status(200);
    res.send(JSON.stringify(output));
    return;
  });
}
