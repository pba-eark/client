<script setup>
import { useGlobalStore } from "~/store/";
import { useDetailsStore } from "~/store/details";
import { useEpicStore } from "~/store/epics";
import { useTaskStore } from "~/store/tasks";
import { useRiskProfileStore } from "~~/store/riskProfiles";

const globalStore = useGlobalStore();
const detailsStore = useDetailsStore();
const epicStore = useEpicStore();
const taskStore = useTaskStore();
const riskProfileStore = useRiskProfileStore();

const route = useRoute();
const epicOptions = reactive({
  value: [],
});
let item = reactive({
  type: null,
  isToggled: false,
});

watch(
  () => detailsStore.DETAILS,
  () => {
    if (detailsStore.DETAILS === null) return (item.isToggled = false);
    item.isToggled = true;

    if (detailsStore.DETAILS.epicName === undefined) {
      item.type = "task";
    } else {
      item.type = "epic";
    }

    epicOptions.value = [];
    epicStore.EPICS.map((epic) => {
      if (epic.estimateSheetId == route.params.id)
        epicOptions.value = [
          ...epicOptions.value,
          { id: epic.id, name: epic.epicName },
        ];
    });
  }
);

const handleUpdateTaskDescription = async (val) => {
  detailsStore.DETAILS.taskDescription = val;
  await taskStore.updateTask(detailsStore.DETAILS);
};

const handleUpdateTaskEpicId = async ({ id }) => {
  detailsStore.DETAILS.epicId = id;
  await taskStore.updateTask(detailsStore.DETAILS);
};

const handleUpdateEstimateReasoning = async (val) => {
  detailsStore.DETAILS.estimateReasoning = val;
  await taskStore.updateTask(detailsStore.DETAILS);
};

const handleUpdateEpicName = async (val) => {
  detailsStore.DETAILS.epicName = val;
  await epicStore.updateEpic(detailsStore.DETAILS);
};

const handleUpdateEpicComment = async (val) => {
  detailsStore.DETAILS.comment = val;
  await epicStore.updateEpic(detailsStore.DETAILS);
};

const handleCopyEpic = (obj) => {
  const epic = { ...obj };
  delete epic.estimateSheetId;
  globalStore.copyEpic(epic);
};

const handleCopyTask = (obj) => {
  const task = { ...obj };
  delete task.id;
  delete task.epicId;
  globalStore.copyTask(task);
};

const handlePasteTask = () => {
  const task = { ...globalStore.TASK_CLIPBOARD };
  task.epicId = detailsStore.DETAILS.id;
  taskStore.createTask(task);
};

/* Computed */
const currentEpic = computed(() => {
  return epicStore.EPICS.filter((epic) => {
    return epic.id == detailsStore.DETAILS.epicId;
  });
});

let showSettings = ref(false);

const show = () => {
  showSettings.value = !showSettings.value;
};

</script>

<template>
  <div class="meta">


    <Button text="Indstillinger" @click="show" />
    <Settings v-if="showSettings" :sheetId="parseInt(route.params.id)" />



    <div v-if="item.isToggled">
      <div class="meta__header">
        <div class="flex">
          <h1>Detaljer</h1>
          <Button text="X" @click="detailsStore.setDetails(null)" />
        </div>

        <h2 v-if="item.type === 'epic'">
          {{ detailsStore.DETAILS.epicName }} - Epic
        </h2>
        <h2 v-else>
          {{ detailsStore.DETAILS.taskName }} - Task ({{
              detailsStore.DETAILS.id
          }})
        </h2>
      </div>

      <div class="meta__body">
        <Button
          v-if="item.type === 'epic'"
          text="Kopiér epic"
          @click="handleCopyEpic(detailsStore.DETAILS)"
        />
        <Button
          v-if="item.type === 'epic'"
          text="Paste task"
          @click="handlePasteTask"
        />
        <Button
          v-if="item.type === 'task'"
          text="Kopiér task"
          @click="handleCopyTask(detailsStore.DETAILS)"
        />

        <div v-if="item.type === 'epic'">
          <Input label="Epic titel" :default="detailsStore.DETAILS.epicName" emit="updateEpicName"
            @updateEpicName="handleUpdateEpicName" />

          <Input type="textarea" label="episk beskrivelse" :default="detailsStore.DETAILS.comment"
            emit="updateEpicComment" @updateEpicComment="handleUpdateEpicComment" />
        </div>

        <div v-if="item.type === 'task'">
          <Input label="Beskrivelse" type="textarea" :default="detailsStore.DETAILS.taskDescription"
            emit="updateTaskDescription" @updateTaskDescription="handleUpdateTaskDescription" />
        </div>

        <div v-if="item.type === 'task'">
          <Input label="Begrundelse for estimat" type="textarea" :default="detailsStore.DETAILS.estimateReasoning"
            emit="updateEstimateReasoning" @updateEstimateReasoning="handleUpdateEstimateReasoning" />
        </div>

        <Input
          label="Flyt til anden epic"
          v-if="item.type === 'task'"
          :placeholder="currentEpic[0].epicName"
          type="select"
          :options="epicOptions.value"
          emit="updateTaskEpicId"
          @updateTaskEpicId="handleUpdateTaskEpicId"
        />

        <Button
          v-if="item.type === 'task'"
          text="Slet task"
          @click="taskStore.deleteTask(detailsStore.DETAILS)"
        />

        <Button
          v-if="item.type === 'epic'"
          text="Slet epic"
          @click="epicStore.deleteEpic(detailsStore.DETAILS)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.meta {
  background-color: var(--color-sidebar);
  padding: 15px;
  color: var(--font-color-primary);

  textarea {
    width: 100%;
    height: 100px;
  }
}

.flex {
  display: flex;
  justify-content: space-between;
}
</style>
