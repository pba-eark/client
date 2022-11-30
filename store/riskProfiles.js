import { defineStore } from "pinia";

export const useRiskProfileStore = defineStore("risk-profile-store", () => {
  /* State */
  const riskProfiles = ref([]);

  /* Actions */
  const setRiskProfiles = (payload) => {
    riskProfiles.value = payload;
  };

  const getRiskProfiles = async (token) => {
    if (!token) return [];
    const runtimeConfig = useRuntimeConfig();

    const riskProfiles = await $fetch(
      `${runtimeConfig.public.API_URL}/riskprofiles`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
