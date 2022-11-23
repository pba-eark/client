import { defineStore } from "pinia";

export const useEstimateSheetStore = defineStore("estimate-sheet-store", () => {
  /* State */
  const estimateSheets = ref([]);

  /* Actions */
  const setEpics = (payload) => {
    estimateSheets.value = payload;
  };

  const getEstimateSheets = async () => {
    const runtimeConfig = useRuntimeConfig();
    const estimateSheets = await $fetch(
      `${runtimeConfig.API_URL}/estimateSheets`
    );

    setEpics(estimateSheets);
  };

  /* Getters */
  const GET_ESTIMATE_SHEETS = computed(() => estimateSheets.value);

  return {
    getEstimateSheets,
    GET_ESTIMATE_SHEETS,
  };
});
