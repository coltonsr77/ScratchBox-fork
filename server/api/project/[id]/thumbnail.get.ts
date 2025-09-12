import { createReadStream } from "fs";
import fs from "fs/promises";

export default defineEventHandler(async (event) => {
  const filePath = getFileLocally(
    getRouterParam(event, "id") + ".png",
    "/thumbnails",
  );

  try {
    await fs.access(filePath, fs.constants.F_OK);
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: "Thumbnail not found.",
    });
  }

  setHeader(event, "Content-Type", "image/png");

  return sendStream(event, createReadStream(filePath));
});
