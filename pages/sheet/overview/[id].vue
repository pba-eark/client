<script setup>
import { useGlobalStore } from "~/store/";
import { useEstimateSheetStore } from "~/store/estimateSheets";
import { useTaskStore } from "~/store/tasks";
import { useEpicStore } from "~/store/epics";

const route = useRoute();
const globalStore = useGlobalStore();
const sheetStore = useEstimateSheetStore();
const taskStore = useTaskStore();
const epicStore = useEpicStore();

onMounted(() => {
  if (!sheetStore.IS_OVERVIEW_TOGGLED) sheetStore.setToggleSheetOverview(true);
});

const handlePasteEpic = async () => {
  const epic = { ...globalStore.EPIC_CLIPBOARD };
  const tasks = [];

  for (let i = 0; taskStore.TASKS.length > i; i++) {
    if (taskStore.TASKS[i].epicId == epic.id) {
      tasks.push({ ...taskStore.TASKS[i] });
    }
  }

  delete epic.id;
  epic.estimateSheetId = parseInt(route.params.id);
  const newEpic = await epicStore.createEpic(epic);

  tasks.forEach(async (task) => {
    delete task.id;
    task.epicId = newEpic.id;
    await taskStore.createTask(task);
  });
};
</script>

<template>
  <Overview />
  <Button text="Paste epic" @click="handlePasteEpic" />
</template>
