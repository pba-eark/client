<script setup>
import { useTaskStore } from "~/store/tasks";
import { useRiskProfileStore } from "~/store/riskProfiles";
import { useRoleStore } from "~/store/roles";
import { useEpicStore } from "~/store/epics";
import { useEpicStatusStore } from "~/store/epicStatus";

const taskStore = useTaskStore();
const riskProfileStore = useRiskProfileStore();
const roleStore = useRoleStore();
const epicStore = useEpicStore();
const epicStatusStore = useEpicStatusStore();
const route = useRoute();

const roundNearQtr = (number) => {
  return (Math.round(number * 4) / 4).toFixed(2);
};

const numberDotSeperator = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const epicsForSheet = computed(() => {
  return epicStore.EPICS.filter((epic) => {
    return epic.estimateSheetId == route.params.id;
  });
});

const epics = ref([]);

epicsForSheet.value.forEach((e) => {
  let totalRealisticHours = 0;
  let totalPessimisticHours = 0;
  let totalRealisticPrice = 0;
  let totalPessimisticPrice = 0;
  const obj = { ...e, tasks: [], optOuts: 0, uncertainty: 0, status: "" };

  /* Get & set epic status */
  const epicStatus = epicStatusStore.EPIC_STATUS.filter((s) => {
    return s.id === e.epicStatusId;
  })[0];

  obj.status = epicStatus;

  /* Get tasks for epic */
  const tasksForEpic = taskStore.TASKS.filter((t) => {
    return t.epicId === e.id;
  });

  tasksForEpic.forEach((task) => {
    if (task.optOut) obj.optOuts++;
    obj.tasks.push(task);
    const currentRiskProfile = riskProfileStore.RISK_PROFILES.filter((p) => {
      return p.id === task.riskProfileId;
    })[0];

    const currentRole = roleStore.ROLES.filter((r) => {
      return r.id === task.roleId;
    })[0];

    /* Total realistic hours */
    totalRealisticHours += parseFloat(
      roundNearQtr(
        task.hourEstimate * (1 + currentRiskProfile.percentage / 2 / 100)
      )
    );

    /* Total realistic price */
    if (currentRole) {
      totalRealisticPrice += parseFloat(
        currentRole.hourlyWage *
          task.hourEstimate *
          (1 + currentRiskProfile.percentage / 2 / 100)
      );
    }

    /* Total pessimistic price */
    totalPessimisticHours += parseFloat(
      roundNearQtr(
        task.hourEstimate * (1 + currentRiskProfile.percentage / 100)
      )
    );

    /* Total pessimistic price */
    if (currentRole) {
      totalPessimisticPrice += parseFloat(
        currentRole.hourlyWage *
          task.hourEstimate *
          (1 + currentRiskProfile.percentage / 100)
      );
    }
  });

  obj.totalRealisticHours = totalRealisticHours;
  obj.totalPessimisticHours = totalPessimisticHours;
  obj.totalRealisticPrice = totalRealisticPrice;
  obj.totalPessimisticPrice = totalPessimisticPrice;

  console.log(obj);
  epics.value.push(obj);
});
</script>

<template>
  <div>
    <h1>Overblik</h1>

    <div class="table">
      <div class="table__header">
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

      <div class="table__row" v-for="epic in epics">
        <div>{{ epic.epicName }}</div>
        <div>{{ epic.totalRealisticHours.toFixed(2).replace(".", ",") }}</div>
        <div>
          {{
            numberDotSeperator(
              epic.totalRealisticPrice.toFixed(2).replace(".", ",")
            )
          }}
        </div>
        <div>{{ epic.totalPessimisticHours.toFixed(2).replace(".", ",") }}</div>
        <div>
          {{
            numberDotSeperator(
              epic.totalPessimisticPrice.toFixed(2).replace(".", ",")
            )
          }}
        </div>
        <div>{{ epic.optOuts }}</div>
        <div>{{ epic.status.epicStatusName }}</div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table {
  &__header,
  &__row {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(9, 1fr);
  }
}
</style>
