import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { typeCheck } from "../helpers/functions";

export const useCustomerStore = defineStore("customer-store", () => {
  const runtimeConfig = useRuntimeConfig();
  const authStore = useAuthStore();

  /* State */
  const customers = ref([]);

  /* Actions */
  const setCustomers = (payload) => {
    customers.value = payload;
  };

  const getCustomers = async () => {
    try {
      const response = await $fetch(
        `${runtimeConfig.public.API_URL}/customers`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.API_TOKEN}`,
          },
        }
      );

      setCustomers(response);
    } catch (e) {
      console.log("Error", e);
      if (e.toString().includes("FetchError: 401"))
        return authStore.handleRelog();
      return false;
    }
  };

  const createCustomer = async (obj) => {
    try {
      const response = await $fetch(
        `${runtimeConfig.public.API_URL}/customers`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.API_TOKEN}`,
          },
          body: obj,
        }
      );

      customers.value = [...customers.value, response];
      return response;
    } catch (e) {
      console.log("Error", e);
      if (e.toString().includes("FetchError: 401"))
        return authStore.handleRelog();
      return false;
    }
  };

  const updateCustomer = async (obj) => {
    const { id } = obj;

    try {
      const response = await $fetch(
        `${runtimeConfig.public.API_URL}/customers/${id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.API_TOKEN}`,
          },
          body: obj,
        }
      );

      update(id, response);
    } catch (e) {
      console.log("Error", e);
      if (e.toString().includes("FetchError: 401"))
        return authStore.handleRelog();
      return false;
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await $fetch(`${runtimeConfig.public.API_URL}/customers/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
      });

      remove(id);
    } catch (e) {
      console.log("Error", e);
      if (e.toString().includes("FetchError: 401"))
        return authStore.handleRelog();
      return false;
    }
  };

  /* Helper functions */
  const update = (id, obj) => {
    customers.value.map((customer) => {
      if (customer.id === typeCheck(id)) Object.assign(customer, obj);
    });
  };

  const remove = (id) => {
    customers.value.forEach((element) => {
      element.id;

      if (element.id === typeCheck(id)) {
        let index = customers.value.findIndex(element);
        customers.value.splice(index, 1);
      }
    });
  };

  /* Getters */
  const CUSTOMERS = computed(() => customers.value);

  return {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    CUSTOMERS,
  };
});
