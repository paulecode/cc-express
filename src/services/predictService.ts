import { logger } from "../utils/logger";

export async function predictService(file: Express.Multer.File) {
  try {
    return await sendToFastAPI(file);
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function sendToFastAPI(file: Express.Multer.File) {
  try {
    const formData = new FormData();
    const blob = new Blob([file.buffer], { type: file.mimetype });
    formData.append("file", blob, file.originalname);

    const baseurl = process.env.FASTAPI_URL || "";

    const url = baseurl + "/predict";
    const result = await fetch(url, {
      body: formData,
      method: "POST",
    });

    logger.info(result);

    return await result.json();
  } catch (err) {
    throw new Error("something went wrong");
  }
}
