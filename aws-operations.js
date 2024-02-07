import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export function handleGetObjectError(err, res) {
  if (err.Code == "NoSuchKey") {
    res.status(404);
    res.send("The referenced image does not exist");
  } else {
    console.log(err);
    res.status(500);
    res.send("Error fetching from aws");
  }
}

export function uploadFileToAWS(file, key) {
  // Set the parameters for the file you want to upload
  const input = {
    Body: file.buffer,
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: file.mimetype,
  };
  const command = new PutObjectCommand(input);
  return client.send(command);
}
