import { ServerFile } from "nuxt-file-storage";

export default defineEventHandler(async (event) => {
  const file = await readBody<ServerFile>(event);
  await storeFileLocally(file, 12, "/projects");
});
