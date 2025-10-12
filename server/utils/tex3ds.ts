import { db } from "./drizzle";
import * as schema from "../database/schema";
import { and, eq, not } from "drizzle-orm";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

export const regenTex3DS = async () => {
  fs.writeFileSync(
    path.join(process.env.MOUNT as string, "unistore", "scratchbox.t3s"),
    (await db.select().from(schema.projects).innerJoin(
      schema.projectPlatforms,
      eq(schema.projects.id, schema.projectPlatforms.projectId),
    ).where(
      and(
        eq(schema.projectPlatforms.platform, "3ds"),
        not(schema.projects.private),
      ),
    )).reduce(
      (a, { projects: project }) =>
        a +
        (getFileLocally(project.id + ".png", "/thumbnails") != null
          ? path.join(
            process.env.MOUNT as string,
            "thumbnails",
            `${project.id}.png`,
          ) + "\n"
          : ""),
      "--atlas -f rgba -z auto\n\n",
    ),
  );

  execSync(
    `tex3ds -i ${
      path.join(process.env.MOUNT as string, "unistore", "scratchbox.t3s")
    } -o ${
      path.join(process.env.MOUNT as string, "unistore", "scratchbox.t3x")
    }`,
  );
};
