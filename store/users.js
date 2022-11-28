import { defineStore } from "pinia";

export const useUserStore = defineStore("user-store", () => {
  /* State */
  const users = ref([]);

  /* Actions */
  const setUsers = (payload) => {
    users.value = payload;
  };

  const getUsers = async (token) => {
    if (!token) return [];
    const runtimeConfig = useRuntimeConfig();
    const response = await $fetch(`${runtimeConfig.public.API_URL}/users`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    setUsers(response);
  };

  /* Getters */
  const USERS = computed(() => users.value);

  return {
    getUsers,
    USERS,
  };
});
