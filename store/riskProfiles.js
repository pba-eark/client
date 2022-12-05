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

  const createRiskProfiles = async (obj) => {

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
  };

  const updateRiskProfiles = async (obj) => {
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

  const deleteRiskProfiles = async (id) => {
    await $fetch(
      `${runtimeConfig.public.API_URL}/sheetstatus/${id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
      });

    remove(id);
  };

  /* Helper functions */
  const update = (id, obj) => {

    riskProfiles.value.map((riskProfile) => {

      if (riskProfile.id === typeCheck(id)) Object.assign(riskProfile, obj);

    });

  };

  const remove = (id) => {

    riskProfiles.value.forEach((element) => {

      element.id;

      if (element.id === typeCheck(id)) {

        let index = riskProfiles.value.findIndex(element);
        riskProfiles.value.splice(index, 1);

      }

    });

  };

  /* Getters */
  const RISK_PROFILES = computed(() => riskProfiles.value);

  return {
    getRiskProfiles,
    createRiskProfiles,
    updateRiskProfiles,
    deleteRiskProfiles,
    RISK_PROFILES
  };
});
