import { defineStore } from "pinia";

export const useRoleStore = defineStore("role-store", () => {
  /* State */
  const roles = ref([]);

  /* Actions */
  const setRoles = (payload) => {
    roles.value = payload;
  };

  const getRoles = async (token) => {
    if (!token) return [];
    const runtimeConfig = useRuntimeConfig();

    const roles = await $fetch(`${runtimeConfig.public.API_URL}/roles`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    setRoles(roles);
  };

  /* Getters */
  const ROLES = computed(() => roles.value);

  return {
    getRoles,
    ROLES,
  };
});
