<script setup>

import { useAuthStore } from "~/store/auth";
import { useEpicStore } from "~/store/epics";
import { useEpicStatusStore } from "~/store/epicstatus";

const authStore = useAuthStore();
const epicStore = useEpicStore();
const epicStatusStore = useEpicStatusStore();

const route = useRoute()

const postData = reactive({
    epic: {
        epicName: "Epic navn",
        estimateSheetId: route.params.id,
        epicStatusId: null
    },
});

const epics = reactive([])

onMounted(async () => {
    await epicStatusStore.getEpicStatus(authStore.API_TOKEN);

    epicStatusStore.EPIC_STATUS.forEach(element => {
        if (element.default) {
            postData.epic.epicStatusId = element.id;
        }
    });

    await epicStore.getEpics(authStore.API_TOKEN);
    epicStore.EPIC_STATUS.forEach(element => {
        epics.push(element);
    });

})

</script>

<template>
    <div>
        <Epic v-for="epic in epics" :key="epic.id" :data="epic" />
        <Button text="Click mig for fanden" @click="epicStore.createEpic(authStore.API_TOKEN, postData.epic)"></Button>
    </div>
</template>
