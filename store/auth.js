import { defineStore } from "pinia";
import { useGlobalStore } from "./index";
import { useUserStore } from "./users";

export const useAuthStore = defineStore("auth-store", () => {
  const globalStore = useGlobalStore();
  const userStore = useUserStore();
  const { $swal } = useNuxtApp();

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
    try {
      const res = await $fetch(`${runtimeConfig.public.API_URL}/auth/login`, {
        method: "POST",
        body: { email, password },
      });

      userStore.setCurrentUser(res.user);
      setJwt(res.token);
      await navigateTo("/");
    } catch (e) {
      console.log("ERROR", e);
      return false;
    }
  };

  const handleLogOut = async () => {
    jwt.value = "";
    isAuthorized.value = false;

    const notification = $swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", $swal.stopTimer);
        toast.addEventListener("mouseleave", $swal.resumeTimer);
      },
    });

    notification.fire({
      icon: "success",
      title: `Logget ud`,
    });

    if (localStorage.getItem("tabs")) localStorage.removeItem("tabs");
    if (localStorage.getItem("recentSheets"))
      localStorage.removeItem("recentSheets");
    if (localStorage.getItem("user")) localStorage.removeItem("user");
    if (localStorage.getItem("jwt")) localStorage.removeItem("jwt");
    if (localStorage.getItem("lastPath")) localStorage.removeItem("lastPath");
    await navigateTo("/login");
  };

  const handleSignUp = async (firstName, lastName, email, password) => {
    try {
      const user = await $fetch(`${runtimeConfig.API_URL}/users`, {
        method: "POST",
        body: {
          firstName,
          lastName,
          email,
          password,
        },
      });
      if (typeof user == "string") return false;
      await handleLogin(user.email, user.password);
    } catch (e) {
      console.log("ERROR", e);
      return false;
    }
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
