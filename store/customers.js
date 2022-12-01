import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export const useCustomerStore = defineStore("customer-store", () => {
  const authStore = useAuthStore();
  const runtimeConfig = useRuntimeConfig();

  /* State */
  const customers = ref([]);

  /* Actions */
  const setCustomers = (payload) => {
    customers.value = payload;
  };

  const getCustomers = async () => {
    const response = await $fetch(`${runtimeConfig.public.API_URL}/customers`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.API_TOKEN}`,
      },
    });

    setCustomers(response);
  };

  /* Getters */
  const CUSTOMERS = computed(() => customers.value);

  return {
    getCustomers,
    CUSTOMERS,
  };
});
