import { createReadStream } from "fs";
import { regenTex3DS } from "../utils/tex3ds";
import fs from "node:fs";

export default defineEventHandler(async (event) => {
  try {
    let filePath = getFileLocally("scratchbox.t3x", "/unistore");

    if (!fs.existsSync(filePath)) {
      await regenTex3DS();
    }

    setHeader(
      event,
      "Content-Disposition",
      `attachment; filename="scratchbox.t3x"`,
    );

    setHeader(event, "Access-Control-Allow-Origin", "*");

    return sendStream(event, createReadStream(filePath));
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
