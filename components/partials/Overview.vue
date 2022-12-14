<script setup>
import { useTaskStore } from "~/store/tasks";
import { useRiskProfileStore } from "~/store/riskProfiles";
import { useRoleStore } from "~/store/roles";
import { useEpicStore } from "~/store/epics";
import { useEpicStatusStore } from "~/store/epicStatus";
import { useUserStore } from "~/store/users";

const taskStore = useTaskStore();
const riskProfileStore = useRiskProfileStore();
const roleStore = useRoleStore();
const epicStore = useEpicStore();
const epicStatusStore = useEpicStatusStore();
const userStore = useUserStore();

const route = useRoute();
const epics = ref([]);
const totalEpicsRealisticHours = ref(0);
const totalEpicsRealisticPrice = ref(0);
const totalEpicsPessimisticHours = ref(0);
const totalEpicsPessimisticPrice = ref(0);

onMounted(() => {
  calculateOverview();
});

watch(
  () => taskStore.TASKS.length,
  () => {
    calculateOverview();
  }
);

const roundNearQtr = (number) => {
  return (Math.round(number * 4) / 4).toFixed(2);
};

const numberDotSeperator = (x) => {
  if (!x) return "0,00";
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const calculateOverview = () => {
  epics.value = [];
  const epicsForSheet = epicStore.EPICS.filter((epic) => {
    return epic.estimateSheetId == route.params.id && !epic.optOut;
  });

  epicsForSheet.forEach((e) => {
    let totalRealisticHours = 0;
    let totalPessimisticHours = 0;
    let totalRealisticPrice = 0;
    let totalPessimisticPrice = 0;

    const epic = {
      ...e,
      roles: [],
      optOuts: 0,
      uncertainty: 0,
      status: {},
      user: {},
    };

    let epicTasks = [];

    /* Get then set epic status */
    const epicStatus = epicStatusStore.EPIC_STATUS.filter((s) => {
      return s.id === e.epicStatusId;
    })[0];

    epic.status = epicStatus;

    /* Get then set user responsible for epic */
    if (epic.userId !== null) {
      const epicUser = userStore.USERS.filter((u) => {
        return u.id === e.userId;
      })[0];

      epic.user = epicUser;
    }

    /* Get tasks for epic */
    const tasksForEpic = taskStore.TASKS.filter((t) => {
      return t.epicId === e.id;
    });

    tasksForEpic.forEach((task) => {
      if (task.optOut) {
        epic.optOuts++;
      }
      const currentRiskProfile = riskProfileStore.RISK_PROFILES.filter((p) => {
        return p.id === task.riskProfileId;
      })[0];

      const currentRole = roleStore.ROLES.filter((r) => {
        return r.id === task.roleId;
      })[0];

      /* Realistic hours */
      task.realisticHours = parseFloat(
        roundNearQtr(
          task.hourEstimate * (1 + currentRiskProfile.percentage / 2 / 100)
        )
      );

      if (!task.optOut) totalRealisticHours += task.realisticHours;

      /* Realistic price */
      if (currentRole) {
        task.realisticPrice = parseFloat(
          currentRole.hourlyWage *
            task.hourEstimate *
            (1 + currentRiskProfile.percentage / 2 / 100)
        );

        if (!task.optOut) totalRealisticPrice += task.realisticPrice;
      }

      /* Pessimistic hours */
      task.pessimisticHours = parseFloat(
        roundNearQtr(
          task.hourEstimate * (1 + currentRiskProfile.percentage / 100)
        )
      );

      if (!task.optOut) totalPessimisticHours += task.pessimisticHours;

      /* Pessimistic price */
      if (currentRole) {
        task.pessimisticPrice = parseFloat(
          currentRole.hourlyWage *
            task.hourEstimate *
            (1 + currentRiskProfile.percentage / 100)
        );

        if (!task.optOut) totalPessimisticPrice += task.pessimisticPrice;
      }

      if (currentRole) {
        if (!epic.roles.some((role) => role.id === currentRole.id)) {
          epic.roles.push({ ...currentRole, tasks: [] });
        }
      }

      if (!task.optOut) {
        totalEpicsRealisticHours.value += task.realisticHours ?? 0;
        totalEpicsRealisticPrice.value += task.realisticPrice ?? 0;
        totalEpicsPessimisticHours.value += task.pessimisticHours ?? 0;
        totalEpicsPessimisticPrice.value += task.pessimisticPrice ?? 0;
      }

      epicTasks.push(task);
    });

    /* Set tasks for epic roles */
    epic.roles.forEach((role) => {
      for (let i = 0; i < epicTasks.length; i++) {
        if (role.id == epicTasks[i].roleId) {
          role.tasks.push(epicTasks[i]);
        }
      }
    });

    epic.totalRealisticHours = totalRealisticHours;
    epic.totalPessimisticHours = totalPessimisticHours;
    epic.totalRealisticPrice = totalRealisticPrice;
    epic.totalPessimisticPrice = totalPessimisticPrice;
    epics.value.push(epic);
  });
};
</script>

<template>
  <div>
    <h1>Overblik</h1>

    <div class="table">
      <div class="table__header">
        <div></div>
        <div>Epic</div>
        <div>Timer</div>
        <div>Pris DKK</div>
        <div>Timer</div>
        <div>Pris DKK</div>
        <div>Fravalgt</div>
        <div>Status</div>
        <div>Ansvarlig</div>
        <div>Usikkerhed</div>
      </div>

      <EpicOverview
        v-for="epic in epics"
        :key="epic.id"
        :id="epic.id"
        :name="epic.epicName"
        :totalRealisticHours="epic.totalRealisticHours"
        :totalRealisticPrice="epic.totalRealisticPrice"
        :totalPessimisticHours="epic.totalPessimisticHours"
        :totalPessimisticPrice="epic.totalPessimisticPrice"
        :optOuts="epic.optOuts"
        :status="epic.status"
        :tasks="epic.tasks"
        :role="epic.role"
        :roles="epic.roles"
        :userId="epic.userId"
        :user="epic.user"
      />
    </div>
    i allah:
    <p>
      realistisk timer:
      {{
        numberDotSeperator(
          totalEpicsRealisticHours.toFixed(2).replace(".", ",")
        )
      }}
    </p>
    <p>
      realistisk pris:
      {{
        numberDotSeperator(
          totalEpicsRealisticPrice.toFixed(2).replace(".", ",")
        )
      }}
    </p>
    <p>
      pessimistisk timer:
      {{
        numberDotSeperator(
          totalEpicsPessimisticHours.toFixed(2).replace(".", ",")
        )
      }}
    </p>
    <p>
      pessimistisk pris:
      {{
        numberDotSeperator(
          totalEpicsPessimisticPrice.toFixed(2).replace(".", ",")
        )
      }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.table {
  &__header {
    width: 100%;
    display: grid;
    grid-template-columns: 50px 200px 150px 150px 150px 150px 125px 150px auto auto;
  }
}
</style>
