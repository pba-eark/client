<script setup>
import { useGlobalStore } from "~/store/";
import { useDetailsStore } from "~/store/details";
import { useEpicStore } from "~/store/epics";
import { useTaskStore } from "~/store/tasks";

const globalStore = useGlobalStore();
const detailsStore = useDetailsStore();
const epicStore = useEpicStore();
const taskStore = useTaskStore();
const { $swal } = useNuxtApp();

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

    showSettings.value = false;

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

  const notification = $swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", $swal.stopTimer);
      toast.addEventListener("mouseleave", $swal.resumeTimer);
    },
  });
  notification.fire({
    icon: "success",
    title: `Epic kopiéret! (${obj.epicName})`,
  });
};

const handleCopyTask = (obj) => {
  const task = { ...obj };
  delete task.id;
  delete task.epicId;
  globalStore.copyTask(task);
};

const handlePasteTask = async () => {
  const task = { ...globalStore.TASK_CLIPBOARD };

  if (!task || Object.keys(task).length === 0) {
    return $swal.fire({
      icon: "error",
      title: "Hovsa! ಠ_ಠ",
      text: "Du har ikke kopiéret nogen task.",
    });
  }

  task.epicId = detailsStore.DETAILS.id;
  await taskStore.createTask(task);
};

const handleDeleteTask = () => {
  $swal
    .fire({
      title: "Sletter task...",
      text: "Er du sikker? Denne handling kan ikke fortrydes.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#777",
      confirmButtonText: `Ja, slet <b>${detailsStore.DETAILS.taskName}</b>`,
      cancelButtonText: `Fortryd`,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        try {
          const notification = $swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", $swal.stopTimer);
              toast.addEventListener("mouseleave", $swal.resumeTimer);
            },
          });

          const taskName = detailsStore.DETAILS.taskName;
          await taskStore.deleteTask(detailsStore.DETAILS);

          notification.fire({
            icon: "success",
            title: `Task slettet (${taskName})`,
          });
        } catch (e) {
          console.log("ERROR", e);
          $swal.fire(
            "Ups! Noget gik galt...",
            "Task blev ikke slettet.",
            "warning"
          );
        }
      }
    });
};
const handleDeleteEpic = () => {
  $swal
    .fire({
      title: "Sletter epic...",
      text: "Er du sikker? Denne handling kan ikke fortrydes.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#777",
      confirmButtonText: `Ja, slet <b>${detailsStore.DETAILS.epicName}</b>`,
      cancelButtonText: `Fortryd`,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        try {
          const notification = $swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", $swal.stopTimer);
              toast.addEventListener("mouseleave", $swal.resumeTimer);
            },
          });

          const epicName = detailsStore.DETAILS.epicName;
          await epicStore.deleteEpic(detailsStore.DETAILS);

          notification.fire({
            icon: "success",
            title: `Epic slettet (${epicName})`,
          });
        } catch (e) {
          console.log("ERROR", e);
          $swal.fire(
            "Ups! Noget gik galt...",
            "Epic blev ikke slettet.",
            "warning"
          );
        }
      }
    });
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

const handleShowSettings = () => {
  show();
  detailsStore.setDetails(null);
};
</script>

<template>
  <div class="meta">
    <div class="meta__settings">
      <div class="filter">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z"
          />
        </svg>
        <span>Filtrér</span>
      </div>

      <div class="settings"><Icon icon="icon-cog" /> Indstillinger</div>

      <div class="profile">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path
            d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
          />
        </svg>
      </div>
    </div>

    <Button text="Indstillinger" @click="handleShowSettings" />
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
          <Input
            label="Epic titel"
            :default="detailsStore.DETAILS.epicName"
            emit="updateEpicName"
            @updateEpicName="handleUpdateEpicName"
          />

          <Input
            type="textarea"
            label="episk beskrivelse"
            :default="detailsStore.DETAILS.comment"
            emit="updateEpicComment"
            @updateEpicComment="handleUpdateEpicComment"
          />
        </div>

        <div v-if="item.type === 'task'">
          <Input
            label="Beskrivelse"
            type="textarea"
            :default="detailsStore.DETAILS.taskDescription"
            emit="updateTaskDescription"
            @updateTaskDescription="handleUpdateTaskDescription"
          />
        </div>

        <div v-if="item.type === 'task'">
          <Input
            label="Begrundelse for estimat"
            type="textarea"
            :default="detailsStore.DETAILS.estimateReasoning"
            emit="updateEstimateReasoning"
            @updateEstimateReasoning="handleUpdateEstimateReasoning"
          />
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
          @click="handleDeleteTask"
        />

        <Button
          v-if="item.type === 'epic'"
          text="Slet epic"
          @click="handleDeleteEpic"
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

  &__settings {
    display: grid;
    grid-template-columns: auto auto 1fr;
    gap: 2rem;
    align-items: center;

    svg {
      height: 25px;
      width: 25px;
    }

    .filter svg {
      cursor: pointer;
    }

    .settings svg {
      cursor: pointer;
    }

    .profile svg {
      display: block;
      margin-left: auto;
      cursor: pointer;
    }
  }

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
