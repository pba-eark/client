import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth-store", () => {
  /* State */
  const jwt = ref("");
  const isAuthorized = ref(false);
  const runtimeConfig = useRuntimeConfig();

  /* Actions */
  const setJwt = (token) => {
    localStorage.setItem("jwt", token);
    jwt.value = token;
    isAuthorized.value = true;
  };

  const handleLogin = async (email, password) => {
    const JWT = await $fetch(`${runtimeConfig.public.API_URL}/auth/login`, {
      method: "POST",
      body: { email, password },
    });

    setJwt(JWT);
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
    const response = await $fetch(`${runtimeConfig.API_URL}/users`, {
      method: "POST",
      body: {
        firstName,
        lastName,
        email,
        password,
      },
    });

    /* FIXME: Log user in, after signing up */
    console.log("sign up res:", response);
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
