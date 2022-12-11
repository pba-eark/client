import { defineStore } from "pinia";
import { useGlobalStore } from "./index";
import { useUserStore } from "./users";

export const useAuthStore = defineStore("auth-store", () => {
  const globalStore = useGlobalStore();
  const userStore = useUserStore();

  /* State */
  const jwt = ref("");
  const isAuthorized = ref(false);
  const runtimeConfig = useRuntimeConfig();

  /* Actions */
  const setJwt = async (token) => {
    localStorage.setItem("jwt", token);
    jwt.value = token;
    /* Fetch data */
    await globalStore.fetchData();
    isAuthorized.value = true;
  };

  const handleLogin = async (email, password) => {
    const res = await $fetch(`${runtimeConfig.public.API_URL}/auth/login`, {
      method: "POST",
      body: { email, password },
    });

    userStore.setCurrentUser(res.user);
    setJwt(res.token);
    navigateTo("/");
  };

  const handleLogOut = () => {
    jwt.value = "";
    isAuthorized.value = false;

    if (localStorage.getItem("jwt")) localStorage.removeItem("jwt");
    if (localStorage.getItem("lastPath")) localStorage.removeItem("lastPath");
    navigateTo("/login");
  };

  const handleSignUp = async (firstName, lastName, email, password) => {
    const user = await $fetch(`${runtimeConfig.API_URL}/users`, {
      method: "POST",
      body: {
        firstName,
        lastName,
        email,
        password,
      },
    });

    await handleLogin(user.email, user.password);
  };

  /* Getters */
  const API_TOKEN = computed(() => jwt.value);
  const IS_AUTHORIZED = computed(() => isAuthorized.value);

  return {
    handleLogin,
    handleLogOut,
    handleSignUp,
    API_TOKEN,
    IS_AUTHORIZED,
    setJwt,
  };
});
