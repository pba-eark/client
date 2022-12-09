import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { typeCheck } from "../helpers/functions";

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
      });

    setRiskProfiles(riskProfiles);
  };

  const createRiskProfile = async (obj) => {

    const response = await $fetch(
      `${runtimeConfig.public.API_URL}/riskprofiles`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
        body: obj,
      });

    riskProfiles.value = [...riskProfiles.value, response];
    return response;
  };

  const updateRiskProfile = async (obj) => {
    const { id } = obj;

    const response = await $fetch(
      `${runtimeConfig.public.API_URL}/riskprofiles/${id}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
        body: obj,
      });

    update(id, response);
  };

  const deleteRiskProfile = async (id) => {
    try {
      await $fetch(
        `${runtimeConfig.public.API_URL}/riskprofiles/${id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.API_TOKEN}`,
          },
        });
    } catch (e) {
      return console.log("Error", e);
    }

    setRiskProfiles(
      riskProfiles.value.filter((profile) => {
        return profile.id !== id;
      })
    );
  };

  /* Helper functions */
  const update = (id, obj) => {

    riskProfiles.value.map((riskProfile) => {

      if (riskProfile.id === typeCheck(id)) Object.assign(riskProfile, obj);

    });

  };

  /* Getters */
  const RISK_PROFILES = computed(() => riskProfiles.value);

  return {
    getRiskProfiles,
    createRiskProfile,
    updateRiskProfile,
    deleteRiskProfile,
    RISK_PROFILES
  };
});
