import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { typeCheck } from "../helpers/functions";

export const useAdditionalExpenseStore = defineStore("additional-expense-store", () => {

  const runtimeConfig = useRuntimeConfig();
  const authStore = useAuthStore();

  /* State */
  const additionalExpenses = ref([]);

  /* Actions */
  const setAdditionalExpenses = (payload) => {
    additionalExpenses.value = payload;
  };

  const getAdditionalExpenses = async () => {
    const response = await $fetch(`${runtimeConfig.public.API_URL}/additionalexpenses`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.API_TOKEN}`,
      },
    });

    setAdditionalExpenses(response);
  };

  const createAdditionalExpense = async (obj) => {

    const response = await $fetch(
      `${runtimeConfig.public.API_URL}/additionalexpenses`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
        body: obj,
      });

    additionalExpenses.value = [...additionalExpenses.value, response];
  };

  const updateAdditionalExpense = async (obj) => {
    const { id } = obj;

    const response = await $fetch(
      `${runtimeConfig.public.API_URL}/additionalexpense/${id}`,
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

  const deleteAdditionalExpense = async (id) => {
    await $fetch(
      `${runtimeConfig.public.API_URL}/additionalexpense/${id}`,
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

    additionalExpenses.value.map((additionalExpense) => {

      if (additionalExpense.id === typeCheck(id)) Object.assign(additionalExpense, obj);

    });

  };

  const remove = (id) => {

    additionalExpenses.value.forEach((element) => {

      element.id;

      if (element.id === typeCheck(id)) {

        let index = additionalExpenses.value.findIndex(element);
        additionalExpenses.value.splice(index, 1);

      }

    });

  };

  /* Getters */
  const ADDITIONAL_EXPENSES = computed(() => additionalExpenses.value);

  return {
    getAdditionalExpenses,
    createAdditionalExpense,
    updateAdditionalExpense,
    deleteAdditionalExpense,
    ADDITIONAL_EXPENSES
  };
});