import { db } from "../../../utils/drizzle";
import * as schema from "../../../database/schema";
import jwt, { JwtPayload } from "jsonwebtoken";
import { and, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "SB_TOKEN");

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  let decoded: string | JwtPayload;
  try {
    decoded = jwt.verify(token, useRuntimeConfig().jwtSecret);
  } catch (e) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const projectId = getRouterParam(event, "id") as string;
  const username = (decoded as { username: string }).username;

  try {
    await db
      .delete(schema.projectLikes)
      .where(
        and(
          eq(schema.projectLikes.projectId, projectId),
          eq(schema.projectLikes.user, username),
        ),
      );

    setResponseStatus(event, 204);
    return;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
