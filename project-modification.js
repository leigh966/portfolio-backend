import { getClient } from "./postgres_client.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import {
  client as aws_client,
  handleGetObjectError,
} from "./aws-operations.js";
import verify from "./verify.js";
import { removeDangerousCharacters } from "./validation.js";

export function addProject(req, res) {
  const pgClient = getClient();
  const json = req.body;
  if (!verify.sessionId(req.headers.session_id)) {
    res.status(401);
    res.send("Authentication Failed");
    return;
  }

  // if an image_filename is given
  if (req.body["image_filename"] != null && req.body["image_filename"] != "") {
    console.log("trying to fetch image from aws");
    let command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: req.body["image_filename"],
    });
    aws_client
      .send(command)
      .then(() => {
        const text =
          "INSERT INTO projects(name, description, tagline, image_filename) VALUES($1, $2, $3, $4) RETURNING *";
        const values = [
          removeDangerousCharacters(json.name),
          removeDangerousCharacters(json.description),
          removeDangerousCharacters(json.tagline),
          removeDangerousCharacters(req.body["image_filename"]),
        ];

        pgClient.query(text, values).then((dbRes) => {
          if (dbRes.rows.length > 0) {
            res.status(201);
            res.send(dbRes.rows[0]);
            return;
          }
          res.status(500);
          res.send("Error writing to db");
        });
      })
      .catch((err) => {
        handleGetObjectError(err, res);
      });
    return;
  }

  const text =
    "INSERT INTO projects(name, description, tagline) VALUES($1, $2, $3) RETURNING *";
  const values = [
    removeDangerousCharacters(json.name),
    removeDangerousCharacters(json.description),
    removeDangerousCharacters(json.tagline),
  ];

  pgClient.query(text, values).then((dbRes) => {
    if (dbRes.rows.length > 0) {
      res.status(201);
      res.send(dbRes.rows[0]);
      return;
    }
    res.status(500);
    res.send("Error writing to db");
  });
}
