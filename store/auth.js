import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth-store", () => {
  /* State */
  const jwt = ref("");
  const isAuthorized = ref(false);
  const jiraAccessToken = ref("");

  /* Actions */
  const setJwt = (token) => {
    localStorage.setItem("jwt", token);
    jwt.value = token;
    isAuthorized.value = true;
  };

  const setJiraAccessToken = (token) => {
    jiraAccessToken.value = token;
    localStorage.setItem("jira", token);
  };

  const handleLogin = async (email, password) => {
    const runtimeConfig = useRuntimeConfig();

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
    localStorage.removeItem("jwt");
    navigateTo("/login");
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

  /* Getters */
  const API_TOKEN = computed(() => jwt.value);
  const IS_AUTHORIZED = computed(() => isAuthorized.value);
  const JIRA_ACCESS_TOKEN = computed(() => jiraAccessToken.value);

  return {
    handleLogin,
    handleLogOut,
    handleSignUp,
    API_TOKEN,
    IS_AUTHORIZED,
    JIRA_ACCESS_TOKEN,
    setJwt,
    setJiraAccessToken
  };
});
