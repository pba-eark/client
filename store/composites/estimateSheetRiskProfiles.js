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

        estimateSheetRiskProfiles.value = [
          ...estimateSheetRiskProfiles.value,
          response,
        ];
      } catch (e) {
        console.log("ERROR", e);
      }
    };

    // const deleteEstimateSheetRiskProfile = async (id) => {
    //   await $fetch(
    //     `${runtimeConfig.public.API_URL}/estimatesheetriskprofiles/${id}`,
    //     {
    //       method: "DELETE",
    //       headers: {
    //         Accept: "application/json",
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${authStore.API_TOKEN}`,
    //       },
    //     }
    //   );

    //   remove(id);
    // };

    // /* Helper functions */
    // const remove = (id) => {
    //   estimateSheetRiskProfiles.value.forEach((element) => {
    //     element.id;

    //     if (element.id === typeCheck(id)) {
    //       let index = estimateSheetRiskProfiles.value.findIndex(element);
    //       estimateSheetRiskProfiles.value.splice(index, 1);
    //     }
    //   });
    // };

    /* Getters */
    const ESTIMATE_SHEET_RISK_PROFILES = computed(
      () => estimateSheetRiskProfiles.value
    );

    return {
      getEstimateSheetRiskProfiles,
      createEstimateSheetRiskProfile,
      // deleteEstimateSheetRiskProfile,
      ESTIMATE_SHEET_RISK_PROFILES,
    };
  }
);
