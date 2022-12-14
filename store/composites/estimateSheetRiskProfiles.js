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
        if (e.toString().includes("FetchError: 401"))
          return authStore.handleRelog();
        return false;
      }
    };

    const deleteEstimateSheetRiskProfile = async (sheetId, profileId) => {
      await $fetch(
        `${runtimeConfig.public.API_URL}/estimatesheetriskprofiles/?sheetId=${sheetId}&profileId=${profileId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.API_TOKEN}`,
          },
        }
      );

      setEstimateSheetRiskProfiles(
        estimateSheetRiskProfiles.value.filter((sheetProfile) => {
          return sheetProfile.id !== profileId;
        })
      );
    };

    /* Getters */
    const ESTIMATE_SHEET_RISK_PROFILES = computed(
      () => estimateSheetRiskProfiles.value
    );

    return {
      getEstimateSheetRiskProfiles,
      createEstimateSheetRiskProfile,
      deleteEstimateSheetRiskProfile,
      ESTIMATE_SHEET_RISK_PROFILES,
    };
  }
);
