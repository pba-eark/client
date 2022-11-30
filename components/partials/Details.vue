<script setup>
import { useDetailsStore } from "~/store/details";
import { useEpicStore } from "~/store/epics";
import { useTaskStore } from "~/store/tasks";

const detailsStore = useDetailsStore();
const epicStore = useEpicStore();
const taskStore = useTaskStore();

const item = reactive({
  type: null,
  data: null,
});

watch(
  () => detailsStore.DETAILS,
  () => {
    item.data = { ...detailsStore.DETAILS };

    detailsStore.DETAILS && detailsStore.DETAILS.hasOwnProperty("epicName")
      ? (item.type = "epic")
      : (item.type = "task");
  }
);

const epicOptions = computed(() => {
  return epicStore.EPICS.map((epic) => {
    return { id: epic.id, name: epic.epicName };
  });
});
</script>

<template>
  <div class="block">
    <div v-show="item.data">
      <div class="block__header">
        <div>
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

      <div class="block__body">
        <label v-if="item.type === 'task'">
          <p>Beskrivelse</p>
          <textarea
            v-model="item.data.taskDescription"
            @change="taskStore.updateTask(item.data.id, item.data)"
          ></textarea>
        </label>

        <label v-if="item.type === 'task'">
          <p>Begrundelse for estimat</p>
          <textarea
            v-model="item.data.estimateReasoning"
            @change="handleEstimateReasoningChange"
          ></textarea>
        </label>

        <Input
          label="Flyt til anden epic"
          placeholder="Vælg epic"
          type="select"
          :options="epicOptions"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.block {
  background: deeppink;
}
</style>
