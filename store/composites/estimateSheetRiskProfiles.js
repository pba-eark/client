import { defineStore } from "pinia";
import { useAuthStore } from "../auth";

export const useEstimateSheetRiskProfileStore = defineStore(
  "estimate-sheet-risk-profile-store",
  () => {
    const runtimeConfig = useRuntimeConfig();
    const authStore = useAuthStore();

    /* State */
    const estimateSheetRiskProfiles = ref([]);

    /* Actions */
    const setEstimateSheetRiskProfiles = (payload) => {
      estimateSheetRiskProfiles.value = payload;
    };

    const getEstimateSheetRiskProfiles = async () => {
      const response = await $fetch(
        `${runtimeConfig.public.API_URL}/estimatesheetriskprofiles`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.API_TOKEN}`,
          },
        }
      );

      setEstimateSheetRiskProfiles(response);
    };

    const createEstimateSheetRiskProfile = async (obj) => {
      try {
        const response = await $fetch(
          `${runtimeConfig.public.API_URL}/estimatesheetriskprofiles`,
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

        setEstimateSheetRiskProfiles([
          ...estimateSheetRiskProfiles.value,
          response,
        ]);
      } catch (e) {
        console.log("ERROR", e);
      }
    };

    /* Getters */
    const ESTIMATE_SHEET_RISK_PROFILES = computed(
      () => estimateSheetRiskProfiles.value
    );

    return {
      getEstimateSheetRiskProfiles,
      createEstimateSheetRiskProfile,
      ESTIMATE_SHEET_RISK_PROFILES,
    };
  }
);
