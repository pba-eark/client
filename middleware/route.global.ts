export default defineNuxtRouteMiddleware((to, from) => {
  if (
    process.client &&
    !to.fullPath.includes("/callback") &&
    !to.fullPath.includes("/login")
  ) {
    localStorage.setItem("lastPath", to.fullPath);
  }
});
