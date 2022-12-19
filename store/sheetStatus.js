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
    try {
      const response = await $fetch(
        `${runtimeConfig.public.API_URL}/sheetstatus`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.API_TOKEN}`,
          },
        }
      );

      setSheetStatus(response);
    } catch (e) {
      console.log("ERROR", e);
      if (e.toString().includes("FetchError: 401"))
        return authStore.handleRelog();
      return false;
    }
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
      }
    );

    sheetStatus.value = [...sheetStatus.value, response];
    return response;
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
      }
    );

    update(id, response);
  };

  const deleteSheetStatus = async (id) => {
    await $fetch(`${runtimeConfig.public.API_URL}/sheetstatus/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.API_TOKEN}`,
      },
    });

    setSheetStatus(
      sheetStatus.value.filter((status) => {
        return status.id !== id;
      })
    );
  };

  /* Helper functions */
  const update = (id, obj) => {
    sheetStatus.value.map((sheetStat) => {
      if (sheetStat.id === typeCheck(id)) Object.assign(sheetStat, obj);
    });
  };

  /* Getters */
  const SHEET_STATUS = computed(() => sheetStatus.value);

  return {
    getSheetStatus,
    createSheetStatus,
    updateSheetStatus,
    deleteSheetStatus,
    SHEET_STATUS,
  };
});
