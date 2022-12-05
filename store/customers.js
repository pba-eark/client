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

  const createCustomer = async (token, obj) => {
    if (!token) return [];
    const runtimeConfig = useRuntimeConfig();

    const response = await $fetch(
      `${runtimeConfig.public.API_URL}/customers`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: obj,
      });

    customers.value = [...customers.value, response];
  };

  const updateCustomer = async (obj) => {
    const { id } = obj;

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
      });

    update(id, response);
  };

  const deleteCustomer = async (id) => {
    await $fetch(
      `${runtimeConfig.public.API_URL}/customers/${id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
      });

    remove(id);
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
    CUSTOMERS
  };
});
