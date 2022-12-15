import { defineStore } from "pinia";
import { useAuthStore } from "../auth";

export const useEstimateSheetRoleStore = defineStore(
  "estimate-sheet-role-store",
  () => {
    const runtimeConfig = useRuntimeConfig();
    const authStore = useAuthStore();

    /* State */
    const estimateSheetRoles = ref([]);

    /* Actions */
    const setEstimateSheetRoles = (payload) => {
        estimateSheetRoles.value = payload;
    };

    const getEstimateSheetRoles = async () => {
      const response = await $fetch(
        `${runtimeConfig.public.API_URL}/estimatesheetroles`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.API_TOKEN}`,
          },
        }
      );

      setEstimateSheetRoles(response);
    };

    const createEstimateSheetRole = async (obj) => {
      const response = await $fetch(
        `${runtimeConfig.public.API_URL}/estimatesheetroles`,
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
      setEstimateSheetRoles([...estimateSheetRoles.value, response]);
    };

    const deleteEstimateSheetRole = async (id) => {
      await $fetch(`${runtimeConfig.public.API_URL}/estimatesheetroles/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
      });

      setEstimateSheetRoles(
        estimateSheetRoles.value.filter((sheet) => {
          return sheet.id !== id;
        })
      );
    };

    /* Getters */
    const ESTIMATE_SHEET_ROLES = computed(() => estimateSheetRoles.value);

    return {
      getEstimateSheetRoles,
      createEstimateSheetRole,
      deleteEstimateSheetRole,
      ESTIMATE_SHEET_ROLES,
    };
  }
);
