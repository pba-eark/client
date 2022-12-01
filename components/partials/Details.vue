<script setup>
import { useDetailsStore } from "~/store/details";
import { useEpicStore } from "~/store/epics";
import { useTaskStore } from "~/store/tasks";

const detailsStore = useDetailsStore();
const epicStore = useEpicStore();
const taskStore = useTaskStore();

const route = useRoute();
const epicOptions = reactive({
  value: [],
});
let item = reactive({
  data: null,
  type: null,
  isToggled: false,
});

watch(
  () => detailsStore.DETAILS,
  () => {
    if (detailsStore.DETAILS === null) return (item.isToggled = false);
    item.isToggled = true;

    item.data = {
      ...detailsStore.DETAILS,
    };

    if (item.data.epicName === undefined) {
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
  item.data.taskDescription = val;
  await taskStore.updateTask(item.data);
};

const handleUpdateEstimateReasoning = async (val) => {
  item.data.estimateReasoning = val;
  await taskStore.updateTask(item.data);
};
</script>

<template>
  <div class="meta">
    {{ item.type }}
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
          {{ detailsStore.DETAILS?.taskName }} - Task ({{
            detailsStore.DETAILS?.id
          }})
        </h2>
      </div>

      <div class="meta__body">
        <label v-if="item.type === 'task'">
          <p>Beskrivelse</p>
          <Input
            type="textarea"
            :default="item.data.taskDescription"
            emit="updateTaskDescription"
            @updateTaskDescription="handleUpdateTaskDescription"
          />
        </label>

        <label v-if="item.type === 'task'">
          <p>Begrundelse for estimat</p>
          <Input
            type="textarea"
            :default="item.data.estimateReasoning"
            emit="updateEstimateReasoning"
            @updateEstimateReasoning="handleUpdateEstimateReasoning"
          />
        </label>

        <Input
          v-if="item.type === 'task'"
          label="Flyt til anden epic"
          placeholder="Vælg epic"
          type="select"
          :options="epicOptions.value"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.meta {
  background: #2e3032;
  padding: 15px;
  color: white;

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
