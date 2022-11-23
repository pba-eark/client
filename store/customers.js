import { defineStore } from "pinia";

export const useCustomerStore = defineStore("customer-store", () => {
  /* State */
  const customers = ref([]);

  /* Actions */
  const setCustomers = (payload) => {
    customers.value = payload;
  };

  const getCustomers = async () => {
    const runtimeConfig = useRuntimeConfig();
    const response = await $fetch(`${runtimeConfig.API_URL}/customers`);

    setCustomers(response);
  };

  /* Getters */
  const GET_CUSTOMERS = computed(() => customers.value);

  return {
    customers,
    getCustomers,
    GET_CUSTOMERS,
  };
});
