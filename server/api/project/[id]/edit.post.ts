import { db } from "../../../utils/drizzle";
import * as schema from "../../../database/schema";
import jwt, { JwtPayload } from "jsonwebtoken";
import { and, eq } from "drizzle-orm";
import { ServerFile } from "nuxt-file-storage";

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
  const project = (await db.select().from(schema.projects).where(
    eq(schema.projects.id, projectId),
  ))[0];

  if (project.user != (decoded as { username: string }).username) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const body = await readBody<
    {
      file: ServerFile;
      name: string;
      description: string;
      platforms: (
        | "scratch"
        | "turbowarp"
        | "3ds"
        | "wiiu"
        | "switch"
        | "wii"
        | "gamecube"
        | "vita"
      )[];
      private: boolean;
    }
  >(event);

  console.log(body.private);

  await db.update(schema.projects).set({
    description: body.description,
    name: body.name,
    private: body.private,
  }).where(
    eq(schema.projects.id, projectId),
  );

  const allPlatforms = [
    "scratch",
    "turbowarp",
    "3ds",
    "wiiu",
    "switch",
    "wii",
    "gamecube",
    "vita",
  ] as (
    | "scratch"
    | "turbowarp"
    | "3ds"
    | "wiiu"
    | "switch"
    | "wii"
    | "gamecube"
    | "vita"
  )[];

  const currentPlatforms = (await db.select({
    platform: schema.projectPlatforms.platform,
  }).from(
    schema.projectPlatforms,
  ).where(
    and(
      eq(schema.projectPlatforms.projectId, projectId),
    ),
  )).map((item) => item.platform);

  for (const platform of allPlatforms) {
    if (
      (body.platforms.includes(platform) &&
        currentPlatforms.includes(platform)) ||
      (!body.platforms.includes(platform) &&
        !currentPlatforms.includes(platform))
    ) continue;

    if (
      body.platforms.includes(platform) && !currentPlatforms.includes(platform)
    ) {
      await db.insert(schema.projectPlatforms).values({ projectId, platform });
      return;
    }

    await db.delete(schema.projectPlatforms).where(
      and(
        eq(schema.projectPlatforms.projectId, projectId),
        eq(schema.projectPlatforms.platform, platform),
      ),
    );
  }

  if (!body.file) return;

  if (!body.file.name.endsWith(".sb3")) {
    throw createError({ statusCode: 415, statusMessage: "Invalid file type" });
  }

  await deleteFile(projectId + ".sb3", "/projects");
  await storeFileLocally(body.file, projectId, "/projects");
});
