import { useAuthStore } from "~/store/auth";
export default defineNuxtRouteMiddleware((to, from) => {
  const store = useAuthStore();
  if (!store.IS_AUTHORIZED) return "/login";
});
