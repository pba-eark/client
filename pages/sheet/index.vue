<script setup>
import { useAuthStore } from "~/store/auth";
import { useEpicStore } from "~/store/epics";
import { useEpicStatusStore } from "~/store/epicstatus";

const authStore = useAuthStore();
const epicStore = useEpicStore();
const epicStatusStore = useEpicStatusStore();

const postData = reactive({
  epic: {
    name: "Epic navn"
    
  },
});

let status = [] 

onMounted( async () => {
    await epicStatusStore.getEpicStatus(authStore.API_TOKEN);
    console.log("Index", epicStore.EPIC_STATUS);
})

const GetStatus = async () => {
    await epicStatusStore.getEpicStatus(authStore.API_TOKEN);
    console.log("Index", epicStore.EPIC_STATUS);
};

</script>

<template>
        <Button @click="CreateEpic(authStore.API_TOKEN, postData.epic)"></Button>
</template>
