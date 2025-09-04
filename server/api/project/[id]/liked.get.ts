import { db } from "../../../utils/drizzle";
import * as schema from "../../../database/schema";
import { and, eq } from "drizzle-orm";
import jwt, { JwtPayload } from "jsonwebtoken";

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

  return (await db.select().from(schema.projectLikes).where(
      and(
        eq(
          schema.projectLikes.projectId,
          getRouterParam(event, "id") as string,
        ),
        eq(
          schema.projectLikes.user,
          (decoded as { username: string }).username,
        ),
      ),
    )).length > 0
    ? true
    : false;
});
