export default defineEventHandler(async (event) => {
  return ((await $fetch(
    `https://api.scratch.mit.edu/users/${getRouterParam(event, "name")}`,
  ) as unknown) as {
    profile: { images: { "90x90": string } };
  }).profile
    .images["90x90"];
});
