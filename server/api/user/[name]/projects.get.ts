import { db } from "../../../utils/drizzle";
import * as schema from "../../../database/schema";
import jwt, { JwtPayload } from "jsonwebtoken";
import { and, eq, not } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const user = getRouterParam(event, "name") as string;

  const token = getCookie(event, "SB_TOKEN");

  let decoded: string | JwtPayload | undefined;
  if (token) {
    try {
      decoded = jwt.verify(token, useRuntimeConfig().jwtSecret);
    } catch {}
  }

  return {
    public: await db.select({
      name: schema.projects.name,
      description: schema.projects.description,
      id: schema.projects.id,
    }).from(
      schema.projects,
    ).where(
      and(eq(schema.projects.user, user), not(schema.projects.private)),
    ),
    private: decoded !== undefined &&
        (decoded as { username: string }).username === user
      ? await db.select({
        name: schema.projects.name,
        description: schema.projects.description,
        id: schema.projects.id,
      }).from(schema.projects).where(
        and(eq(schema.projects.user, user), schema.projects.private),
      )
      : undefined,
  };
});
