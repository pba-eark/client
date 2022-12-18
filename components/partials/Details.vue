<script setup>
import { useGlobalStore } from "~/store/";
import { useDetailsStore } from "~/store/details";
import { useEpicStore } from "~/store/epics";
import { useTaskStore } from "~/store/tasks";
import { useAuthStore } from "~/store/auth";

const globalStore = useGlobalStore();
const detailsStore = useDetailsStore();
const epicStore = useEpicStore();
const taskStore = useTaskStore();
const authStore = useAuthStore();
const { $swal } = useNuxtApp();

const route = useRoute();
const epicOptions = reactive({
  value: [],
});
let item = reactive({
  type: null,
  isToggled: false,
});
const isProfileDropdownToggled = ref(false);
const sidebar = ref(null);

onBeforeMount(() => {
  window.addEventListener("click", handleClick);
});

onBeforeUnmount(() => {
  /* Clean up eventlistener */
  window.removeEventListener("click", handleClick);
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
          const res = await taskStore.deleteTask(detailsStore.DETAILS);

          if (!res)
            return $swal.fire(
              "Ups! Noget gik galt...",
              "Task blev ikke slettet.",
              "warning"
            );

          notification.fire({
            icon: "success",
            title: `Task slettet (${taskName})`,
          });

          return detailsStore.setDetails(null);
        } catch (e) {
          console.log("ERROR", e);
          return $swal.fire(
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
          const res = await epicStore.deleteEpic(detailsStore.DETAILS);

          if (!res)
            return $swal.fire(
              "Ups! Noget gik galt...",
              "Epic blev ikke slettet.",
              "error"
            );

          notification.fire({
            icon: "success",
            title: `Epic slettet (${epicName})`,
          });

          return detailsStore.setDetails(null);
        } catch (e) {
          console.log("ERROR", e);
          return $swal.fire(
            "Ups! Noget gik galt...",
            "Epic blev ikke slettet.",
            "warning"
          );
        }
      }
    });
};

const getParents = (node) => {
  let current = node,
    list = [];
  while (
    current.parentNode != null &&
    current.parentNode != document.documentElement
  ) {
    list.push(current.parentNode);
    current = current.parentNode;
  }
  return list;
};

const handleClick = (e) => {
  if (!isProfileDropdownToggled.value) return;

  if (
    e.target === sidebar.value ||
    !getParents(e.target).includes(sidebar.value)
  )
    return (isProfileDropdownToggled.value = false);
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
  <div class="meta" ref="sidebar">
    <div class="meta__settings">
      <div class="filter">
        <Icon icon="icon-filter" />
        <span>Filtrér</span>
      </div>

      <div class="settings">
        <Icon icon="icon-cog" />
        <span> Indstillinger </span>
      </div>

      <div class="profile">
        <Icon
          icon="icon-profile"
          @click="isProfileDropdownToggled = !isProfileDropdownToggled"
        />
        <!-- Profile dropdown -->
        <div
          v-show="isProfileDropdownToggled"
          ref="profileDropdown"
          class="dropdown"
        >
          <Button
            text="Log ud"
            icon="icon-logout"
            @click="authStore.handleLogOut"
          />
        </div>
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

    .profile {
      position: relative;

      svg {
        display: block;
        margin-left: auto;
        cursor: pointer;
      }

      .dropdown {
        position: absolute;
        padding: 8px 16px;
        border: 2px solid #777;
        border-radius: 3px;
        right: 0;
        top: 30px;

        button {
          border: none;
          background: transparent;
          cursor: pointer;
          width: 10ch;
        }
      }
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
