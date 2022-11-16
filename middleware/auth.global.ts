import { useAuthStore } from "~/store/auth";
export default defineNuxtRouteMiddleware((to, from) => {
  const store = useAuthStore();

  if (!store.IS_AUTHORIZED && to.fullPath !== "/login") return "/login";
  if (store.IS_AUTHORIZED && to.fullPath === "/login") return "/";
});
