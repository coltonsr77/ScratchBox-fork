import { db } from "../utils/drizzle";
import * as schema from "../database/schema";
import { sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery<{ q: string; p: string; ps: string }>(event);
  const pageSize = Number(query.ps || "20");

  return {
    results: db
      .all(
        sql`SELECT p.id, p.name, p.description FROM ${schema.projects} AS p JOIN projects_fts AS pf ON p.id = pf.id WHERE pf.projects_fts MATCH ${query.q} AND p.private = false LIMIT ${pageSize} OFFSET ${
          (Number(query.p || "1") - 1) * pageSize
        };`,
      ),
    anotherPage: Math.ceil(
          db
            .all<{ count: number }>(
              sql`SELECT COUNT(*) as count FROM ${schema.projects} AS p JOIN projects_fts AS pf ON p.id = pf.id WHERE pf.projects_fts MATCH ${query.q} AND p.private = false;`,
            )[0].count / pageSize,
        ) - Number(query.p || "1") > 0,
  };
});
