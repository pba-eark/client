import { defineStore } from "pinia";

export const useEpicStatusStore = defineStore("epic-status-store", () => {
    /* State */
    const epicStatus = ref([]);

    /* Actions */
    const setEpicStatus = (payload) => {
        epicStatus.value = payload;
    };

    const getEpicStatus = async (token) => {
        if (!token) return [];
        const runtimeConfig = useRuntimeConfig();

        const response = await $fetch(
            `${runtimeConfig.public.API_URL}/epicstatus`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        setEpicStatus(response);
    };

    const createEpicStatus = async (token, obj) => {
        if (!token) return [];
        const runtimeConfig = useRuntimeConfig();

        const response = await $fetch(
            `${runtimeConfig.public.API_URL}/epicstatus`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: obj,
            }
        );

        console.log("post epic res", response);
    };

    /* Getters */
    const EPIC_STATUS = computed(() => epicStatus.value);

    return {
        getEpicStatus,
        createEpicStatus,
        EPIC_STATUS
    };

});