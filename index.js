// Importing express module
import express from "express";
const app = express();
import { getClient } from "./postgres_client.js";
import { upload_image } from "./images.js";
import multer from "multer";
import fs from "fs";
import https from "https";
app.use(express.json());
app.use(express.static("public"));
import { Project } from "./Database/Entities/Project.js";

import { config } from "dotenv";
config();
import sanitizer from "sanitize";
import { v4 as uuidv4 } from "uuid";

import { AwsImageHandler } from "./ImageHandlers/AwsImageHandler.js";
import { FsImageHandler } from "./ImageHandlers/FsImageHandler.js";

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
      cb(null, ImageHandler.generateFilename(file));
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

app.delete("/project/:id", (req, res) =>
  verifyEndpoint(req, res, () =>
    standardDelete(req.paramInt("id"), res, Project)
  )
);
app.delete("/employment/:id", (req, res) =>
  verifyEndpoint(req, res, () =>
    standardDelete(req.paramInt("id"), res, Employment)
  )
);
app.delete("/education/:id", (req, res) =>
  verifyEndpoint(req, res, () =>
    standardDelete(req.paramInt("id"), res, Education)
  )
);

app.get("/education", (req, res) => standardGetAll(res, Education));
app.get("/employment", (req, res) => standardGetAll(res, Employment));
app.get("/projects", (req, res) => standardGetAll(res, Project));

app.post("/project", (req, res) =>
  verifyEndpoint(req, res, () => standardInsert(req.body, res, Project))
);
app.post("/employment", (req, res) =>
  verifyEndpoint(req, res, () => standardInsert(req.body, res, Employment))
);
app.post("/education", (req, res) =>
  verifyEndpoint(req, res, () => standardInsert(req.body, res, Education))
);

app.put("/project/:id", (req, res) =>
  verifyEndpoint(req, res, () =>
    standardUpdate(req.paramInt("id"), req.body, res, Project)
  )
);
app.put("/employment/:id", (req, res) =>
  verifyEndpoint(req, res, () =>
    standardUpdate(req.paramInt("id"), req.body, res, Employment)
  )
);
app.put("/education/:id", (req, res) =>
  verifyEndpoint(req, res, () =>
    standardUpdate(req.paramInt("id"), req.body, res, Education)
  )
);

import verify, { verifyEndpoint } from "./verify.js";

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
app.get("/image_url/:filename", (req, res) => {
  image_handler.get_url(req.params.filename).then((url) => {
    res.send(url);
    res.status(200);
  });
});
import setup_table from "./setup_table.js";
import {
  standardDelete,
  standardGetAll,
  standardInsert,
  standardUpdate,
} from "./standardised-endpoints.js";
import { client } from "./aws-operations.js";
import { ImageHandler } from "./ImageHandlers/ImageHandler.js";
setup_table(getClient());
import { Education } from "./Database/Entities/Education.js";
import { Employment } from "./Database/Entities/Employment.js";

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
