import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export const useRoleStore = defineStore("role-store", () => {
  const runtimeConfig = useRuntimeConfig();
  const authStore = useAuthStore();
  /* State */
  const roles = ref([]);

  /* Actions */
  const setRoles = (payload) => {
    roles.value = payload;
  };

  const getRoles = async () => {
    const roles = await $fetch(`${runtimeConfig.public.API_URL}/roles`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.API_TOKEN}`,
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
