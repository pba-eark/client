<script setup>
import { useAuthStore } from "~/store/auth";
import { useEpicStore } from "~/store/epics";
import { useEpicStatusStore } from "~/store/epicstatus";
import { useEstimateSheetStore } from "~/store/estimatesheets";

const authStore = useAuthStore();
const epicStore = useEpicStore();
const epicStatusStore = useEpicStatusStore();
const estimateSheetStore = useEstimateSheetStore();

const postData = reactive({
  epic: {
    name: "Epic navn",
    estimateSheetId: null,
    epicStatusId: null
  },
});

onMounted( async () => {
  await epicStatusStore.getEpicStatus(authStore.API_TOKEN);
  await estimateSheetStore.getEstimateSheets(authStore.API_TOKEN);

  postData.epic.estimateSheetId = estimateSheetStore.ESTIMATE_SHEETS[0].id;
  //postData.epic.epicStatusId = epicStatusStore.EPIC_STATUS[0].id;

  epicStatusStore.EPIC_STATUS.forEach(element => {
    //console.log(element.default);
    if (element.default) {
      postData.epicStatusId = element.id;
    }
  });
})



</script>

<template>
        <Button text="Click mig for fanden" @click="epicStore.createEpic(authStore.API_TOKEN, postData.epic)"></Button>
        <p v-for="status in epicStatusStore.EPIC_STATUS">{{status}}</p>
</template>
