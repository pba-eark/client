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

const handleUpdateEpicName = async (val) => {
  item.data.epicName = val;
  await epicStore.updateEpic(item.data);
};

const handleUpdateEpicComment = async (val) => {
  item.data.comment = val;
  await epicStore.updateEpic(item.data);
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

        <h2 v-if="item.type === 'epic'">{{ item.data.epicName }} - Epic</h2>
        <h2 v-else>{{ item.data.taskName }} - Task ({{ item.data.id }})</h2>
      </div>

      <div class="meta__body">
        <div v-if="item.type === 'epic'">
          <Input
            label="brumbrum"
            :default="item.data.epicName"
            emit="updateEpicName"
            @updateEpicName="handleUpdateEpicName"
          />

          <Input
            type="textarea"
            label="episk beskrivelse"
            :default="item.data.comment"
            emit="updateEpicComment"
            @updateEpicComment="handleUpdateEpicComment"
          />
        </div>

        <div v-if="item.type === 'task'">
          <Input
            label="Beskrivelse"
            type="textarea"
            :default="item.data.taskDescription"
            emit="updateTaskDescription"
            @updateTaskDescription="handleUpdateTaskDescription"
          />
        </div>

        <div v-if="item.type === 'task'">
          <Input
            label="Begrundelse for estimat"
            type="textarea"
            :default="item.data.estimateReasoning"
            emit="updateEstimateReasoning"
            @updateEstimateReasoning="handleUpdateEstimateReasoning"
          />
        </div>

        <Input
          label="Flyt til anden epic"
          v-if="item.type === 'task'"
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
