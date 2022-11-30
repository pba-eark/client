import { defineStore } from "pinia";

export const useEstimateSheetStore = defineStore("estimate-sheet-store", () => {
  const route = useRoute();

  /* State */
  const estimateSheets = ref([]);

  /* Actions */
  const setEstimateSheets = (payload) => {
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

    setEstimateSheets(estimateSheets);
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

    setEstimateSheets([...estimateSheets.value, response]);
  };

  /* Getters */
  const ESTIMATE_SHEETS = computed(() => estimateSheets.value);
  const CURRENT_ESTIMATE_SHEET = computed(() =>
    estimateSheets.value.filter((s) => {
      if (s.id == route.params.id) return s;
    })
  );

  return {
    getEstimateSheets,
    createEstimateSheet,
    ESTIMATE_SHEETS,
    CURRENT_ESTIMATE_SHEET,
  };
});
