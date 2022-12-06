import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { typeCheck } from "../helpers/functions";

export const useSheetStatusStore = defineStore("sheet-status-store", () => {

  const runtimeConfig = useRuntimeConfig();
  const authStore = useAuthStore();

  /* State */
  const sheetStatus = ref([]);

  /* Actions */
  const setSheetStatus = (payload) => {
    sheetStatus.value = payload;
  };

  const getSheetStatus = async () => {
    const response = await $fetch(`${runtimeConfig.public.API_URL}/sheetstatus`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.API_TOKEN}`,
      },
    });

    setSheetStatus(response);
  };

  const createSheetStatus = async (obj) => {

    const response = await $fetch(
      `${runtimeConfig.public.API_URL}/sheetstatus`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
        body: obj,
      });

    sheetStatus.value = [...sheetStatus.value, response];
  };

  const updateSheetStatus = async (obj) => {
    const { id } = obj;

    const response = await $fetch(
      `${runtimeConfig.public.API_URL}/sheetstatus/${id}`,
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

  const deleteSheetStatus = async (id) => {
    await $fetch(
      `${runtimeConfig.public.API_URL}/sheetstatus/${id}`,
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

    sheetStatus.value.map((sheetStat) => {

      if (sheetStat.id === typeCheck(id)) Object.assign(sheetStat, obj);

    });

  };

  const remove = (id) => {

    sheetStatus.value.forEach((element) => {

      element.id;

      if (element.id === typeCheck(id)) {

        let index = sheetStatus.value.findIndex(element);
        sheetStatus.value.splice(index, 1);

      }

    });

  };

  /* Getters */
  const SHEET_STATUS = computed(() => sheetStatus.value);

  return {
    getSheetStatus,
    createSheetStatus,
    updateSheetStatus,
    deleteSheetStatus,
    SHEET_STATUS
  };
});