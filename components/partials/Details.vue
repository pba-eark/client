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
</script>

<template>
  <div class="block">
    {{ item.type }}
    <div v-if="item.isToggled">
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
            @change="taskStore.updateTask(item.data)"
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
.block {
  background: deeppink;
}
</style>