import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { typeCheck } from "../helpers/functions";

export const useEstimateSheetStore = defineStore("estimate-sheet-store", () => {
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();
  const authStore = useAuthStore();

  /* State */
  const estimateSheets = ref([]);
  const isOverviewToggled = ref(false);

  /* Actions */
  const setEstimateSheets = (payload) => {
    estimateSheets.value = payload;
  };

  const getEstimateSheets = async () => {
    try {
      const estimateSheets = await $fetch(
        `${runtimeConfig.public.API_URL}/estimatesheets`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.API_TOKEN}`,
          },
        }
      );

      setEstimateSheets(estimateSheets);
    } catch (e) {
      console.log("ERROR", e);
      if (e.toString().includes("FetchError: 401"))
        return authStore.handleRelog();
      return false;
    }
  };

  const createEstimateSheet = async (obj) => {
    const response = await $fetch(
      `${runtimeConfig.public.API_URL}/estimatesheets`,
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

    setEstimateSheets([...estimateSheets.value, response]);

    return response;
  };

  const toggleSheetOverview = async (id) => {
    isOverviewToggled.value = !isOverviewToggled.value;
    return isOverviewToggled.value
      ? await navigateTo(`/sheet/overview/${id}`)
      : await navigateTo(`/sheet/${id}`);
  };

  const setToggleSheetOverview = (payload) => {
    isOverviewToggled.value = payload;
  };

  const updateEstimateSheet = async (obj) => {
    const { id } = obj;

    try {
      const response = await $fetch(
        `${runtimeConfig.public.API_URL}/estimatesheets/${id}`,
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

      estimateSheets.value.map((sheet) => {
        if (sheet.id === typeCheck(id)) Object.assign(sheet, response);
      });
    } catch (e) {
      console.log("ERROR", e);
      if (e.toString().includes("FetchError: 401"))
        return authStore.handleRelog();
      return false;
    }
  };

  // const deleteEstimateSheet = async (id) => {
  //   await $fetch(`${runtimeConfig.public.API_URL}/estimatesheets/${id}`, {
  //     method: "DELETE",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${authStore.API_TOKEN}`,
  //     },
  //   });

  //   remove(id);
  // };

  /* Getters */
  const ESTIMATE_SHEETS = computed(() => estimateSheets.value);
  const CURRENT_ESTIMATE_SHEET = computed(
    () =>
      estimateSheets.value.filter((s) => {
        if (s.id == route.params.id) return s;
      })[0]
  );
  const IS_OVERVIEW_TOGGLED = computed(() => isOverviewToggled.value);

  return {
    getEstimateSheets,
    createEstimateSheet,
    updateEstimateSheet,
    // deleteEstimateSheet,
    ESTIMATE_SHEETS,
    CURRENT_ESTIMATE_SHEET,
    IS_OVERVIEW_TOGGLED,
    toggleSheetOverview,
    setToggleSheetOverview,
  };
});
