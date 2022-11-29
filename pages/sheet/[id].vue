<script setup>
import { useAuthStore } from "~/store/auth";
import { useEpicStore } from "~/store/epics";
import { useEpicStatusStore } from "~/store/epicstatus";
import { useTaskStore } from "~/store/tasks";

const authStore = useAuthStore();
const epicStore = useEpicStore();
const epicStatusStore = useEpicStatusStore();
const taskStore = useTaskStore();

const route = useRoute();

const postData = reactive({
  epic: {
    epicName: "Test epic",
    estimateSheetId: route.params.id,
    epicStatusId: null,
  },
});

const epics = reactive([]);

onMounted(async () => {
  await epicStatusStore.getEpicStatus(authStore.API_TOKEN);

  epicStatusStore.EPIC_STATUS.forEach((element) => {
    if (element.default) {
      postData.epic.epicStatusId = element.id;
    }
  });

  await epicStore.getEpics(authStore.API_TOKEN, route.params.id);

  console.log("???", epicStore.EPICS);

  //   epicStore.EPICS.forEach((element) => {
  //     epics.push(element);
  //   });

  //   epicStore.EPICS.forEach(async (element) => {
  //     await taskStore.getTasks(authStore.API_TOKEN, element.id);
  //   });
});
</script>

<template>
  <div>
    {{ $route.params.id }}

    <br />epics: {{ epicStore.EPICS }}

    <div>
      <Epic v-for="epic in epics" :key="epic.id" :data="epic" />
      <Button
        text="Click mig for fanden"
        @click="epicStore.createEpic(authStore.API_TOKEN, postData.epic)"
      ></Button>

      <p v-for="status in epicStatusStore.EPIC_STATUS">{{ status }}</p>
      <div>
        <Task v-for="task in taskStore.TASK_STATUS">{{ task }}</Task>
      </div>
    </div>
  </div>
</template>
