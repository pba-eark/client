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
    const saveObject = ref({
        sheets: {
            createSheets: [],
            editSheets: [],
            deleteSheets: []
        },
        epics: {
            createEpics: [],
            editEpics: [],
            deleteEpics: []
        },
        tasks: {
            createTasks: [],
            editTasks: [],
            deleteTasks: []
        }
    });

    const sheet = "sheet";
    const epic = "epic";
    const task = "task";

    /* Actions */
    const saveToObject = (type, action, data) => {

        console.log("type", type)
        console.log("action", action)
        console.log("data", data)

        switch (type) {
            case "sheet":
                switch (action) {
                    case "create":
                        saveObject.value.sheets.createSheets.push(data);
                        break;
                    case "edit":
                        saveObject.value.sheets.editSheets.push(data);
                        break;
                    case "delete":
                        saveObject.value.sheets.deleteSheets.push(data);
                        break;
                }
                break;
            case "epic":
                switch (action) {
                    case "create":
                        saveObject.value.epics.createEpics.push(data);
                        break;
                    case "edit":
                        saveObject.value.epics.editEpics.push(data);
                        break;
                    case "delete":
                        saveObject.value.epics.deleteEpics.push(data);
                        break;
                }
                break;
            case "task":
                switch (action) {
                    case "create":
                        saveObject.value.epics.createTasks.push(data);
                        break;
                    case "edit":
                        saveObject.value.epics.editTasks.push(data);
                        break;
                    case "delete":
                        saveObject.value.epics.deleteTasks.push(data);
                        break;
                }
                break;
        }
    }

    const saveToDatabase = async () => {

        // EstimateSheets
        if (saveObject.value.sheets.createSheets.length > 0) {
            createAction(saveObject.value.sheets.createSheets, sheet);
        }

        if (saveObject.value.sheets.editSheets.length > 0) {
            editAction(saveObject.value.sheets.editSheets, sheet);
        }

        if (saveObject.value.sheets.deleteSheets.length > 0) {
            deleteAction(saveObject.value.sheets.deleteSheets, sheet);
        }

        // Epics
        if (saveObject.value.epics.createEpics.length > 0) {
            createAction(saveObject.value.epics.createEpics, epic);
        }

        if (saveObject.value.epics.editEpics.length > 0) {
            editAction(saveObject.value.epics.editEpics, epic);
        }

        if (saveObject.value.epics.deleteEpics.length > 0) {
            deleteAction(saveObject.value.epics.deleteEpics, epic);
        }

        // Tasks
        if (saveObject.value.tasks.createTasks.length > 0) {
            createAction(saveObject.value.tasks.createTasks, task);
        }

        if (saveObject.value.tasks.editTasks.length > 0) {
            editAction(saveObject.value.tasks.editTasks, task);
        }

        if (saveObject.value.tasks.deleteTasks.length > 0) {
            deleteAction(saveObject.value.tasks.deleteTasks, task);
        }

    };

    const createAction = async (objects, type) => {
        await objects.forEach(async item => {
            switch (type) {
                case "sheet":
                    await estimateSheetStore.createEstimateSheet(authStore.API_TOKEN, item);
                    break;
                case "epic":
                    await epicStore.createEpic(authStore.API_TOKEN, item);
                    break;
                case "task":
                    await taskStore.createTask(authStore.API_TOKEN, item);
                    break;
            }
        });
    };

    const editAction = async (objects, type) => {
        await objects.forEach(async item => {
            switch (type) {
                case "sheet":
                    await estimateSheetStore.editEstimateSheet(authStore.API_TOKEN, item);
                    break;
                case "epic":
                    await epicStore.editEpic(authStore.API_TOKEN, item);
                    break;
                case "task":
                    await taskStore.editTask(authStore.API_TOKEN, item);
                    break;
            }
        });
    };

    const deleteAction = async (objects, type) => {
        await objects.forEach(async item => {
            switch (type) {
                case "sheet":
                    await estimateSheetStore.deleteEstimateSheet(authStore.API_TOKEN, item);
                    break;
                case "epic":
                    await epicStore.deleteEpic(authStore.API_TOKEN, item);
                    break;
                case "task":
                    await taskStore.deleteTask(authStore.API_TOKEN, item);
                    break;
            }
        });
    };

    /* Getters */
    //const SHEET_ARRAY = computed(() => sheetArray.value);

    return {
        saveToObject,
        saveToDatabase,
    };
});