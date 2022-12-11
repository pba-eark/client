import { defineStore } from "pinia";
import { useAuthStore } from "../auth";

export const useEstimateSheetUserStore = defineStore(
  "estimate-sheet-user-store",
  () => {
    const runtimeConfig = useRuntimeConfig();
    const authStore = useAuthStore();

    /* State */
    const estimateSheetUsers = ref([]);

    /* Actions */
    const setEstimateSheetUsers = (payload) => {
      estimateSheetUsers.value = payload;
    };

    const getEstimateSheetUsers = async () => {
      const response = await $fetch(
        `${runtimeConfig.public.API_URL}/estimatesheetusers`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.API_TOKEN}`,
          },
        }
      );

      setEstimateSheetUsers(response);
    };

    const createEstimateSheetUser = async (obj) => {
      const response = await $fetch(
        `${runtimeConfig.public.API_URL}/estimatesheetusers`,
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
      setEstimateSheetUsers([...estimateSheetUsers.value, response]);
    };

    const deleteEstimateSheetUser = async (id) => {
      await $fetch(`${runtimeConfig.public.API_URL}/estimatesheetusers/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.API_TOKEN}`,
        },
      });

      setEstimateSheetUsers(
        estimateSheetUsers.value.filter((sheet) => {
          return sheet.id !== id;
        })
      );
    };

    /* Getters */
    const ESTIMATE_SHEET_USERS = computed(() => estimateSheetUsers.value);

    return {
      getEstimateSheetUsers,
      createEstimateSheetUser,
      deleteEstimateSheetUser,
      ESTIMATE_SHEET_USERS,
    };
  }
);
