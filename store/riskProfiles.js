import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export const useRiskProfileStore = defineStore("risk-profile-store", () => {
  const runtimeConfig = useRuntimeConfig();
  const authStore = useAuthStore();

  /* State */
  const riskProfiles = ref([]);

  /* Actions */
  const setRiskProfiles = (payload) => {
    riskProfiles.value = payload;
  };

  const getRiskProfiles = async () => {
    const riskProfiles = await $fetch(
      `${runtimeConfig.public.API_URL}/riskprofiles`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
      }
    );

    setRiskProfiles(riskProfiles);
  };

  /* Getters */
  const RISK_PROFILES = computed(() => riskProfiles.value);

  return {
    getRiskProfiles,
    RISK_PROFILES,
  };
});
