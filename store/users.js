import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
export const useUserStore = defineStore("user-store", () => {
  const runtimeConfig = useRuntimeConfig();
  const authStore = useAuthStore();

  /* State */
  const users = ref([]);
  const currentUser = ref({});

  /* Actions */
  const setUsers = (payload) => {
    users.value = payload;
  };

  const setCurrentUser = (payload) => {
    currentUser.value = payload;
    localStorage.setItem("user", JSON.stringify(payload));
  };

  const getUsers = async () => {
    const response = await $fetch(`${runtimeConfig.public.API_URL}/users`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.API_TOKEN}`,
      },
    });

    setUsers(response);
  };

  /* Getters */
  const USERS = computed(() => users.value);
  const CURRENT_USER = computed(() => currentUser.value);

  return {
    setCurrentUser,
    getUsers,
    USERS,
    CURRENT_USER,
  };
});
