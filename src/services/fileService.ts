import { s3 } from "../lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function fileUpload(
  bucketName: string,
  file: Express.Multer.File,
) {
  const uploadParameters = {
    Bucket: bucketName,
    Body: file.buffer,
    Key: `${Date.now()}-${file.originalname}`,
    ContentType: file.mimetype,
  };

  return s3.send(new PutObjectCommand(uploadParameters));
}
