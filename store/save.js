import { defineStore } from "pinia";
import { useAuthStore } from "~/store/auth";
import { useEpicStore } from "~/store/epics";
import { useEstimateSheetStore } from "~/store/estimateSheets";
import { useTaskStore } from "~/store/tasks";



export const useSaveStore = defineStore("save-store", () => {
    const authStore = useAuthStore();
    const epicStore = useEpicStore();
    const estimateSheetStore = useEstimateSheetStore();
    const taskStore = useTaskStore();

    /* State */
    const saveArray = ref([]);
    const sheetArray = ref([]);
    const epicArray = ref([]);
    const taskArray = ref([]);


    /* Actions */
    const saveToArray = (arrayType, data) => {

        console.log(data)

        switch (arrayType) {
            case "sheet":
                sheetArray.value.push(data);
                break;
            case "epic":
                epicArray.value.push(data);
                break;
            case "task":
                taskArray.value.push(data);
                break;
        }
    }

    const saveToDatabase = async () => {

        
        saveArray.value.push(sheetArray);
        saveArray.value.push(epicArray);
        saveArray.value.push(taskArray);

        console.log(saveArray.value)

        saveArray.value.forEach(async element => {

            if (element.value == sheetArray.value && sheetArray.value.length > 0) {

                await element.value.forEach(async item => {
                    await estimateSheetStore.createEstimateSheet(authStore.API_TOKEN, item)
                });

            }

            if (element.value == epicArray.value && epicArray.value.length > 0) {

                await element.value.forEach(async item => {
                    await epicStore.createEpic(authStore.API_TOKEN, item)
                });

            }

            if (element.value == taskArray.value && epicArray.value.length > 0) {

                await element.value.forEach(async item => {
                    await taskStore.createTask(authStore.API_TOKEN, item)
                });

            }

        });
    };

    /* Getters */
    const SHEET_ARRAY = computed(() => sheetArray.value);
    const EPIC_ARRAY = computed(() => epicArray.value);
    const TASK_ARRAY = computed(() => taskArray.value);

    return {
        saveToArray,
        saveToDatabase,
        SHEET_ARRAY,
        EPIC_ARRAY,
        TASK_ARRAY
    };
});