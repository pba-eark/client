<script setup>
import { useTaskStore } from "~/store/tasks";
import { useRiskProfileStore } from "~/store/riskProfiles";
import { useRoleStore } from "~/store/roles";
import { useEpicStore } from "~/store/epics";

const taskStore = useTaskStore();
const riskProfileStore = useRiskProfileStore();
const roleStore = useRoleStore();
const epicStore = useEpicStore();
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

const tasksForEpic = computed(() => {
  return taskStore.TASKS.filter((task) => {
    return task.epicId == route.params.id;
  });
});

const totalEstimatedHours = ref(0);
const totalRealisticHours = ref(0);
const totalPessimisticHours = ref(0);
const totalRealisticPrice = ref(0);
const totalPessimisticPrice = ref(0);

tasksForEpic.value.forEach((task) => {
  const currentRiskProfile = riskProfileStore.RISK_PROFILES.filter((p) => {
    return p.id === task.riskProfileId;
  })[0];

  const currentRole = roleStore.ROLES.filter((r) => {
    return r.id === task.roleId;
  })[0];

  /* Total estimated hours */
  totalEstimatedHours.value += task.hourEstimate;

  /* Total realistic hours */
  totalRealisticHours.value += parseFloat(
    roundNearQtr(
      task.hourEstimate * (1 + currentRiskProfile.percentage / 2 / 100)
    )
  );

  /* Total realistic price */
  if (currentRole) {
    totalRealisticPrice.value += parseFloat(
      currentRole.hourlyWage *
        task.hourEstimate *
        (1 + currentRiskProfile.percentage / 2 / 100)
    );
  }

  /* Total pessimistic price */
  totalPessimisticHours.value += parseFloat(
    roundNearQtr(task.hourEstimate * (1 + currentRiskProfile.percentage / 100))
  );

  /* Total pessimistic price */
  if (currentRole) {
    totalPessimisticPrice.value += parseFloat(
      currentRole.hourlyWage *
        task.hourEstimate *
        (1 + currentRiskProfile.percentage / 100)
    );
  }
});
</script>

<template>
  <div>
    <h1>Overblik</h1>

    epics: {{ epicsForSheet }}
    <div>
      <div>
        Estimat i alt {{ totalEstimatedHours.toFixed(2).replace(".", ",") }}
      </div>

      <div>
        Realistisk timer i alt
        {{ totalRealisticHours.toFixed(2).replace(".", ",") }}
      </div>

      <div>
        Realistisk pris i alt
        {{
          numberDotSeperator(totalRealisticPrice.toFixed(2).replace(".", ","))
        }}
      </div>

      <div>
        Pessimistic timer i alt
        {{ totalPessimisticHours.toFixed(2).replace(".", ",") }}
      </div>

      <div>
        Pessimistic pris i alt
        {{
          numberDotSeperator(totalPessimisticPrice.toFixed(2).replace(".", ","))
        }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
