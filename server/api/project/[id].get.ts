import { db } from "../../utils/drizzle";
import * as schema from "../../database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const project = (await db.select().from(schema.projects).where(
    eq(schema.projects.id, getRouterParam(event, "id") as string),
  ).limit(1))[0];

  if (project === undefined) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project not found",
    });
  }

  return project;
});
