import { createReadStream } from "fs";

export default defineEventHandler(async (event) => {
  const filePath = getFileLocally(
    getRouterParam(event, "id") + ".png",
    "/thumbnails",
  );

  if (!filePath) {
    throw createError({
      statusCode: 404,
      statusMessage: "Thumbnail not found.",
    });
  }

  setHeader(event, "Content-Type", "image/png");

  return sendStream(event, createReadStream(filePath));
});
