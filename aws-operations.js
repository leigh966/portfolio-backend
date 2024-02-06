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

export async function uploadFileToAWS(file, key) {
  const input = {
    Body: file,
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentEncoding: "utf-8",
  };
  const command = new PutObjectCommand(input);
  return client.send(command);
}
