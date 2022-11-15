import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth-store", () => {
  /* State */
  const jwt = ref("");
  const isAuthorized = ref(false);

  /* Actions */
  const setJwt = (token) => {
    localStorage.setItem("jwt", token);
    jwt.value = token;
    isAuthorized.value = true;
  };

  const handleLogin = async (email, password) => {
    const runtimeConfig = useRuntimeConfig();

    const JWT = await $fetch(`${runtimeConfig.public.API_URL}/authentication`, {
      method: "POST",
      body: { email, password },
    });

    setJwt(JWT);
  };

  const handleSignUp = async (firstName, lastName, email, password) => {
    const runtimeConfig = useRuntimeConfig();

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

  /* Lifecycle hooks */
  onMounted(() => {
    /* FIXME: need to validate JWT - create API endpoint for this */
    if (localStorage.getItem("jwt")) setJwt(localStorage.getItem("jwt"));
  });

  /* Getters */
  const API_TOKEN = computed(() => jwt.value);
  const IS_AUTHORIZED = computed(() => isAuthorized.value);

  return { handleLogin, handleSignUp, API_TOKEN, IS_AUTHORIZED };
});
