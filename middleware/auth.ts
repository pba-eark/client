import { useAuthStore } from "~/store/auth";
export default defineNuxtRouteMiddleware((to, from) => {
  console.log("bumbum?");
  const store = useAuthStore();
  if (!store.IS_AUTHORIZED) return "/login";
});
