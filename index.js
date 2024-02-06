// Importing express module
import express from "express";
const app = express();
import { getClient } from "./postgres_client.js";
import { upload_image, get_image } from "./images.js";
app.use(express.json());

import { GetObjectCommand } from "@aws-sdk/client-s3";
import {
  client as aws_client,
  handleGetObjectError,
} from "./aws-operations.js";

import { config } from "dotenv";
config();
import sanitizer from "sanitize";
app.use(sanitizer.middleware);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const lowerCase = "qwertyuiopasdfghjklzxcvbnmm";
const upperCase = lowerCase.toUpperCase();
const allowedCharacters = lowerCase + upperCase + "1234567890";
function removeDangerousCharacters(s) {
  let output = "";
  for (let i = 0; i < s.length; i++) {
    if (!allowedCharacters.includes(s[i])) {
      const replacement = `#${s.charCodeAt(i)}#`;
      output += replacement;
    } else {
      output += s[i];
    }
  }
  return output;
}

function restoreDangerousCharacters(s) {
  const list = s.split("#");
  let output = "";
  for (let i = 0; i < list.length; i++) {
    if (i % 2 == 1) {
      output += String.fromCharCode(list[i]);
    } else {
      output += list[i];
    }
  }
  return output;
}

app.post("/image", upload_image);

app.delete("/project/:id", (req, res) => {
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
});

app.put("/project/:id", (req, res) => {
  const pgClient = getClient();
  if (!verify.sessionId(req.headers.session_id)) {
    res.status(401);
    res.send("Authentication Failed");
    return;
  }
  const name = removeDangerousCharacters(req.bodyString("name"));
  const description = removeDangerousCharacters(req.bodyString("description"));
  const tagline = removeDangerousCharacters(req.bodyString("tagline"));
  const query = `UPDATE projects SET name='${name}', tagline='${tagline}', description='${description}', last_updated=now() WHERE id=${req.paramInt(
    "id"
  )} RETURNING *`;
  pgClient.query(query).then((dbRes) => {
    if (dbRes.rows.length > 0) {
      res.status(200);
      res.send(dbRes.rows[0]);
      return;
    }
    res.status(500);
    res.send("Error writing to db - is your id correct?");
  });
});

app.get("/projects", (req, res) => {
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
      output.push(outputRow);
    }
    res.status(200);
    res.send(JSON.stringify(output));
    return;
  });
});

app.post("/project", (req, res) => {
  const pgClient = getClient();
  const json = req.body;
  if (!verify.sessionId(req.headers.session_id)) {
    res.status(401);
    res.send("Authentication Failed");
    return;
  }

  // if an image_filename is given
  if (req.body["image_filename"] != null) {
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
});

import verify from "./verify.js";
import Console from "console";

app.post("/login", (req, res) => {
  const json = req.body;
  const passwordCorrect = verify.password(
    json.password,
    process.env.SALT,
    process.env.PASSWORD_HASH
  );
  const otpCorrect = verify.otp(req.bodyInt("otp"));
  if (passwordCorrect && otpCorrect) {
    res.status(201);
    verify.createSession(res);
    return;
  }
  res.status(401);
  res.send("Failed To Authenticate");
});

import path from "path";
app.get("/image/:filename", get_image);

//require("./setup_table").setup(getClient()); // setup table
import setup_table from "./setup_table.js";
setup_table(getClient());
// Server setup
app.listen(process.env.PORT, () => {
  console.log("Server is Running");
});
