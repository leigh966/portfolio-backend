import { getClient } from "./postgres_client.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import {
  client as aws_client,
  handleGetObjectError,
} from "./aws-operations.js";
import verify from "./verify.js";
import { removeDangerousCharacters } from "./validation.js";
import { image_exists } from "./images.js";
import { Project } from "./Database/Entities/Project.js";

export function addProject(req, res) {
  const pgClient = getClient();
  const json = req.body;
  if (!verify.sessionId(req.headers.session_id)) {
    res.status(401);
    res.send("Authentication Failed");
    return;
  }
  const project = new Project(pgClient, json);
  // if an image_filename is given
  if (req.body["image_filename"] != null && req.body["image_filename"] != "") {
    image_exists(req.body["image_filename"], res)
      .then((exists) => {
        if (exists) {
          project.insertThis().then((success) => {
            if (success) {
              res.status(201);
              res.send("Record added");
              return;
            }
            res.status(500);
            res.send("Error writing to db");
          });
        } else {
          res.status(404);
          res.send("The referenced image does not exist");
        }
      })
      .catch((err) => {
        handleGetObjectError(err, res);
      });

    return;
  }
  project.insertThis().then((success) => {
    if (success) {
      res.status(201);
      res.send("Record added");
      return;
    }
    res.status(500);
    res.send("Error writing to db");
  });
}
export function deleteProject(req, res) {
  const pgClient = getClient();
  if (!verify.sessionId(req.headers.session_id)) {
    res.status(401);
    res.send("Authentication Failed");
    return;
  }
  const query = `DELETE FROM projects WHERE id=${req.paramInt(
    "id"
  )} RETURNING *`;
  pgClient.query(query).then((dbRes) => {
    res.status(204);
    res.send("Done");
  });
}
