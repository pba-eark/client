import { defineStore } from "pinia";

export const useEstimateSheetStore = defineStore("estimate-sheet-store", () => {
  /* State */
  const estimateSheets = ref([]);

  /* Actions */
  const setEpics = (payload) => {
    estimateSheets.value = payload;
  };

  const getEstimateSheets = async (token) => {
    if (!token) return [];
    const runtimeConfig = useRuntimeConfig();

    const estimateSheets = await $fetch(
      `${runtimeConfig.public.API_URL}/estimatesheets`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setEpics(estimateSheets);
  };

  const createEstimateSheet = async (token, obj) => {
    if (!token) return [];
    const runtimeConfig = useRuntimeConfig();

    const response = await $fetch(
      `${runtimeConfig.public.API_URL}/estimatesheets`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: obj,
      }
    );

    console.log("post sheet res", response);
  };

  /* Getters */
  const GET_ESTIMATE_SHEETS = computed(() => estimateSheets.value);

  return {
    getEstimateSheets,
    createEstimateSheet,
    GET_ESTIMATE_SHEETS,
  };
});
