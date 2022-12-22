<script setup>
import { useGlobalStore } from "~/store/";
import { useEstimateSheetStore } from "~/store/estimateSheets";
import { useTaskStore } from "~/store/tasks";
import { useEpicStore } from "~/store/epics";
import { useTabsStore } from "~/store/tabs";

const route = useRoute();
const globalStore = useGlobalStore();
const sheetStore = useEstimateSheetStore();
const taskStore = useTaskStore();
const epicStore = useEpicStore();
const tabStore = useTabsStore();
const { $swal } = useNuxtApp();

onMounted(() => {
  if (!sheetStore.IS_OVERVIEW_TOGGLED) sheetStore.setToggleSheetOverview(true);
  if (tabStore.TEMP_TAB?.id === parseInt(route.params.id))
    tabStore.openTab(tabStore.TEMP_TAB);
});

const handlePasteEpic = async () => {
  const epic = { ...globalStore.EPIC_CLIPBOARD };

  if (!epic || Object.keys(epic).length === 0) {
    return $swal.fire({
      icon: "error",
      title: "Hovsa! ಠ_ಠ",
      text: "Du har ikke kopiéret nogen epic.",
    });
  }

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
  <div>
    <Overview />
    <div class="button-placement">
      <Button class="paste-epic" text="Paste epic" @click="handlePasteEpic" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.button-placement {
  display: flex;
  justify-content: right;
  align-items: center;
  width: 100%;
  padding-bottom: 50px;
}
.paste-epic {
  
}
</style>
