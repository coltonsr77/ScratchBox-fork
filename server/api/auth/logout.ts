export default defineEventHandler(async (event) => {
  setCookie(event, "SB_TOKEN", "", {
    httpOnly: true,
    maxAge: 0,
  });
  sendRedirect(event, "/", 303);
});
