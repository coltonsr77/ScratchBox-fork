import { db } from "../../../utils/drizzle";
import * as schema from "../../../database/schema";
import { count, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, "id") as string;

  const project = (await db.select().from(schema.projects).where(
    eq(schema.projects.id, projectId),
  ).limit(1))[0];

  if (project === undefined) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project not found",
    });
  }

  return {
    ...project,
    likes: (await db.select({ count: count() }).from(schema.projectLikes).where(
      eq(schema.projectLikes.projectId, projectId),
    ))[0].count,
    platforms:
      (await db.select().from(schema.projectPlatforms).where(
        eq(schema.projectPlatforms.projectId, projectId),
      )).map((projectPlatform) => projectPlatform.platform),
  };
});
