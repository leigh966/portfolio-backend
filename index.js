// Importing express module
import express from "express";
const app = express();
import { getClient } from "./postgres_client.js";
import { upload_image, get_image } from "./images.js";
import multer from "multer";
import { addProject, deleteProject } from "./project-modification.js";
import fs from "fs";
import https from "https";
app.use(express.json());
app.use(express.static("public"));
import { Project } from "./Project.js";

import { config } from "dotenv";
config();
import sanitizer from "sanitize";
import { v4 as uuidv4 } from "uuid";

import { AwsImageHandler } from "./AwsImageHandler.js";
import { FsImageHandler } from "./FsImageHandler.js";

var storage;
var image_handler;
if (process.env.S3_BUCKET) {
  storage = multer.memoryStorage();
  image_handler = new AwsImageHandler(client);
} else {
  image_handler = new FsImageHandler();
  storage = multer.diskStorage({
    destination: (request, file, cb) => {
      cb(null, "public/");
    },
    filename: (request, file, cb) => {
      let uuid = uuidv4().toString();
      var temp_file_arr = file.originalname.split(".");
      var temp_file_extension = temp_file_arr[temp_file_arr.length - 1];
      cb(null, uuid + "." + temp_file_extension);
    },
  });
}
var upload = multer({ storage: storage });

app.use(sanitizer.middleware);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/image", upload.single("image"), (req, res) =>
  upload_image(req, res, image_handler)
);

app.delete("/project/:id", deleteProject);

app.get("/education", (req, res) => standardGetAll(res, Education));
app.get("/employment", (req, res) => standardGetAll(res, Employment));

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
  const image_filename = removeDangerousCharacters(
    req.bodyString("image_filename")
  );
  const query = `UPDATE projects SET name='${name}', tagline='${tagline}', description='${description}', last_updated=now(), image_filename='${image_filename}' WHERE id=${req.paramInt(
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

app.get("/projects", (req, res) => standardGetAll(res, Project));

app.post("/project", addProject);

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

app.get("/image/:filename", get_image);
app.get("/image_url/:filename", (req, res) => {
  image_handler.get_url(req.params.filename).then((url) => {
    res.send(url);
    res.status(200);
  });
});
import setup_table from "./setup_table.js";
import { removeDangerousCharacters } from "./validation.js";
import { standardGetAll } from "./standardised-endpoints.js";
setup_table(getClient());
import { Education } from "./Education.js";
import { Employment } from "./Employment.js";

// Server setup
if (process.env.ENABLE_HTTPS == "true") {
  var privateKey = fs.readFileSync(process.env.HTTPS_KEY, "utf8");
  var certificate = fs.readFileSync(process.env.HTTPS_CERT, "utf8");
  var credentials = { key: privateKey, cert: certificate };
  https.createServer(credentials, app).listen(process.env.PORT, () => {
    console.log("Server is Running with HTTPS");
  });
} else {
  app.listen(process.env.PORT, () => {
    console.log("Server is Running");
  });
}
