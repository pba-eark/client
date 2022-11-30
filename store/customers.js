import { defineStore } from "pinia";

export const useCustomerStore = defineStore("customer-store", () => {
  /* State */
  const customers = ref([]);

  /* Actions */
  const setCustomers = (payload) => {
    customers.value = payload;
  };

  const getCustomers = async (token) => {
    console.log("TRYING TO GET CUSTOMERS HHHNNNNGGGG", token);
    if (!token) return [];
    const runtimeConfig = useRuntimeConfig();
    const response = await $fetch(`${runtimeConfig.public.API_URL}/customers`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
