import { getClient } from "./postgres_client.js";
import { restoreDangerousCharacters } from "./validation.js";

export function getAllProjects(req, res) {
  const pgClient = getClient();
  pgClient.query("SELECT * FROM projects").then((dbRes) => {
    let output = [];
    for (let i = 0; i < dbRes.rows.length; i++) {
      let outputRow = {};
      outputRow.id = dbRes.rows[i].id;
      outputRow.name = restoreDangerousCharacters(dbRes.rows[i].name);
      outputRow.description = restoreDangerousCharacters(
        dbRes.rows[i].description
      );
      outputRow.last_updated = dbRes.rows[i].last_updated;
      outputRow.tagline = restoreDangerousCharacters(dbRes.rows[i].tagline);
      outputRow.image_filename = dbRes.rows[i].image_filename
        ? restoreDangerousCharacters(dbRes.rows[i].image_filename)
        : null;

      output.push(outputRow);
    }
    res.status(200);
    res.send(JSON.stringify(output));
    return;
  });
}
