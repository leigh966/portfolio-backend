import { ImageHandler } from "./ImageHandler.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { uploadFileToAWS } from "./aws-operations.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
export class AwsImageHandler extends ImageHandler {
  constructor(aws_client) {
    super();
    this.aws_client = aws_client;
  }

  async save(file) {
    const filename = ImageHandler.generateFilename(file);
    // if using aws
    await uploadFileToAWS(file.buffer, filename);
    return filename;
  }

  async get_url(filename) {
    let command = await new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: filename,
      Expires: 60,
    });

    return await getSignedUrl(this.aws_client, command);
  }
}
