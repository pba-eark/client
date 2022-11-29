<script setup>

import { useAuthStore } from "~/store/auth";
import { useEpicStore } from "~/store/epics";
import { useEpicStatusStore } from "~/store/epicstatus";
import { useEstimateSheetStore } from "~/store/estimatesheets";
import { useTaskStore } from "~/store/tasks";

const authStore = useAuthStore();
const epicStore = useEpicStore();
const epicStatusStore = useEpicStatusStore();
const estimateSheetStore = useEstimateSheetStore();
const taskStore = useTaskStore();

const route = useRoute()

const postData = reactive({
    epic: {
        epicName: "Epic navn",
        estimateSheetId: route.params.id,
        epicStatusId: null
    },
});

onMounted(async () => {
    await epicStatusStore.getEpicStatus(authStore.API_TOKEN);
    await estimateSheetStore.getEstimateSheets(authStore.API_TOKEN);

    epicStatusStore.EPIC_STATUS.forEach(element => {
        if (element.default) {
            postData.epic.epicStatusId = element.id;
        }
    });

    await epicStore.getEpics(authStore.API_TOKEN);

    epicStore.EPIC_STATUS.forEach( async element => {
        await taskStore.getTasks(authStore.API_TOKEN, element.id);
    });
    
})

</script>

<template>
    <div>
        <Button text="Click mig for fanden" @click="epicStore.createEpic(authStore.API_TOKEN, postData.epic)"></Button>
        <div>
            <p v-for="status in epicStatusStore.EPIC_STATUS">{{ status }}</p>
            <div>
                <Task v-for="task in taskStore.TASK_STATUS">{{ task }}</Task>
            </div>
        </div>
    </div>
</template>
