import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import {
  uploadFileToAWS,
  client as aws_client,
  handleGetObjectError,
} from "./aws-operations.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import verify from "./verify.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export async function image_exists(image_filename) {
  // if using aws
  if (process.env.S3_BUCKET) {
    // try to fetch the image
    console.log("trying to fetch image from aws");
    let command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: image_filename,
    });
    await aws_client.send(command);
    return true;
  }
  // else
  // check the filesystem for it
  console.log(__dirname);
  if (fs.existsSync(__dirname + "/public/" + image_filename)) {
    return true;
  }
  return false;
}
import { restoreDangerousCharacters } from "./validation.js";
export function upload_image(request, response, image_handler) {
  // if (!verify.sessionId(request.headers.session_id)) {
  //   response.status(401);
  //   response.send("Authentication Failed");
  //   return;
  // }

  image_handler.save(request.file).then((filename) => {
    response.status(201);
    response.send(filename);
  });
}

export function get_image(req, res) {
  const filename = req.paramString("filename");
  let command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: filename,
  });
  aws_client
    .send(command)
    .then((awsResponse) => {
      res.status(200);
      const splitFn = filename.split(".");
      res.type(splitFn[splitFn.length - 1]);
      const options = {
        root: path.join("temp"),
      };
      let filePath = "temp/" + filename;
      function resolve() {
        res.sendFile(filename, options);
      }
      let file = fs.createWriteStream(filePath);
      // Attach a 'data' listener to add the chunks of data to our array
      // Each chunk is a Buffer instance
      awsResponse.Body.on("data", (chunk) => {
        file.write(chunk);
      });

      // Once the stream has no more data, join the chunks into a string and return the string
      awsResponse.Body.once("end", resolve);
    })
    .catch((err) => {
      handleGetObjectError(err, res);
    });
}
