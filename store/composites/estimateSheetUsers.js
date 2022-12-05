import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { typeCheck } from "../helpers/functions";

export const useEstimateSheetUserStore = defineStore("estimate-sheet-user-store", () => {

  const runtimeConfig = useRuntimeConfig();
  const authStore = useAuthStore();

  /* State */
  const estimateSheetUsers = ref([]);

  /* Actions */
  const setEstimateSheetUsers = (payload) => {
    estimateSheetUsers.value = payload;
  };

  const getEstimateSheetUsers = async () => {
    const response = await $fetch(`${runtimeConfig.public.API_URL}/estimatesheetusers`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.API_TOKEN}`,
      },
    });

    setEstimateSheetUsers(response);
  };

  const createEstimateSheetUser = async (obj) => {

    const response = await $fetch(
      `${runtimeConfig.public.API_URL}/estimatesheetusers`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
        body: obj,
      });

      estimateSheetUsers.value = [...estimateSheetUsers.value, response];
  };

  const deleteEstimateSheetUser = async (id) => {
    await $fetch(
      `${runtimeConfig.public.API_URL}/estimatesheetusers/${id}`,
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
  const remove = (id) => {

    estimateSheetUsers.value.forEach((element) => {

      element.id;

      if (element.id === typeCheck(id)) {

        let index = estimateSheetUsers.value.findIndex(element);
        estimateSheetUsers.value.splice(index, 1);

      }

    });

  };

  /* Getters */
  const ESTIMATE_SHEET_USERS = computed(() => additionalExpenses.value);

  return {
    getEstimateSheetUsers,
    createEstimateSheetUser,
    deleteEstimateSheetUser,
    ESTIMATE_SHEET_USERS
  };
});