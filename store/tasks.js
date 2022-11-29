import { defineStore } from "pinia";

export const useTaskStore = defineStore("task-store", () => {
    /* State */
    const tasks = ref([]);

    /* Actions */
    const setTasks = (payload) => {
        tasks.value = payload;
    };

    const getTasks = async (token, epicId) => {
        if (!token) return [];
        const runtimeConfig = useRuntimeConfig();

        const tasks = await $fetch(
            `${runtimeConfig.public.API_URL}/tasks/epic/${epicId}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        setTasks(tasks);
    };

    /* Getters */
    const TASKS = computed(() => tasks.value);

    return {
        getTasks,
        TASKS
    };
});