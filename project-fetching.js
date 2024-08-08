import { getClient } from "./postgres_client.js";
import { DatabaseEntity } from "./DatabaseEntity.js";

export function getAllProjects(req, res) {
  const pgClient = getClient();
  let projectEntity = new DatabaseEntity("projects", getClient());
  projectEntity.getAll().then((output) => {
    res.status(200);
    res.send(JSON.stringify(output));
    return;
  });
}
