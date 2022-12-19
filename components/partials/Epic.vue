<script setup>
import { useTaskStore } from "~/store/tasks";
import { useDetailsStore } from "~/store/details";
import { useRiskProfileStore } from "~/store/riskProfiles";
import { useRoleStore } from "~/store/roles";

const taskStore = useTaskStore();
const detailsStore = useDetailsStore();
const riskProfileStore = useRiskProfileStore();
const roleStore = useRoleStore();

const totalEstimatedHours = ref(0);
const totalRealisticHours = ref(0);
const totalPessimisticHours = ref(0);
const totalRealisticPrice = ref(0);
const totalPessimisticPrice = ref(0);

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const taskOptOuts = ref(0);

onMounted(() => {
  calculateTotals();
});

watch(
  () => taskStore.TASKS.length,
  () => {
    calculateTotals();
  }
);

const handleCreateTask = async () => {
  const firstGlobalRiskProfile = riskProfileStore.RISK_PROFILES.filter(
    (profile) => {
      return profile;
    }
  )[0];

  if (!firstGlobalRiskProfile)
    return $swal.fire(
      "Der skete en fejl.",
      "Der findes endnu ingen globale risikoprofiler. Opret en global risikoprofil og prøv igen.",
      "warning"
    );

  const newTask = {
    parentId: 0,
    taskName: "Ny task",
    hourEstimate: 0,
    estimateReasoning: "Begrundelse for estimat...",
    optOut: false,
    taskDescription: "Beskrivelse...",
    epicId: parseInt(props.data.id),
    roleId: 0,
    riskProfileId: firstGlobalRiskProfile.id,
  };

  await taskStore.createTask(newTask);
};

const handleTaskUpdate = () => {
  calculateTotals();
};

const roundNearQtr = (number) => {
  return (Math.round(number * 4) / 4).toFixed(2);
};

const numberDotSeperator = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const calculateTotals = () => {
  taskOptOuts.value = 0;
  totalEstimatedHours.value = 0;
  totalRealisticHours.value = 0;
  totalPessimisticHours.value = 0;
  totalRealisticPrice.value = 0;
  totalPessimisticPrice.value = 0;

  tasksForEpic.value.forEach((task) => {
    if (task.optOut) {
      taskOptOuts.value++;
      return null;
    }
    const currentRiskProfile = riskProfileStore.RISK_PROFILES.filter((p) => {
      return p.id === task.riskProfileId;
    })[0];

    const currentRole = roleStore.ROLES.filter((r) => {
      return r.id === task.roleId;
    })[0];

    /* Total estimated hours */
    totalEstimatedHours.value += parseFloat(task.hourEstimate);

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
      roundNearQtr(
        task.hourEstimate * (1 + currentRiskProfile.percentage / 100)
      )
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
};
const tasksForEpic = computed(() => {
  return taskStore.TASKS.filter((task) => {
    return task.epicId === props.data.id;
  });
});
</script>

<template>
  <div class="epic" :data-epic-id="props.data.id">
    <div class="epic__header">
      <div class="flex">
        <h2 class="epic__name">{{ props.data.epicName }}</h2>
        <Button
          class="edit-epic"
          icon="icon-dots"
          @click="detailsStore.setDetails(props.data)"
        />
      </div>
      <span class="epic__opted-out">
        {{ `${taskOptOuts} ${taskOptOuts === 1 ? "task" : "tasks"}` }}
        fravalgt
      </span>
      <div class="epic__table-header">
        <div class="epic__table-col">
          <span class="epic__table-heading--name"> Task navn </span>
        </div>

        <div class="epic__table-col">
          <span class="epic__table-heading--risk"> Risikoprofil </span>
        </div>

        <div class="epic__table-col">
          <span class="epic__table-heading--role"> Rolle </span>
        </div>

        <div class="epic__table-col epic__table--right">
          <span class="epic__table-heading--estimate"> Estimat </span>
        </div>

        <div class="epic__table-header--realistic">
          <div class="epic__table-col epic__table--right">
            <span class="epic__table-heading--hours"> Timer </span>
          </div>

          <div class="epic__table-col epic__table--right">
            <span class="epic__table-heading--price"> Pris DKK </span>
          </div>
        </div>

        <div class="epic__table-header--pessimistic">
          <div class="epic__table-col epic__table--right">
            <span class="epic__table-heading--hours"> Timer </span>
          </div>

          <div class="epic__table-col epic__table--right">
            <span class="epic__table-heading--price"> Pris DKK </span>
          </div>
        </div>

        <div class="epic__table-col">
          <span class="epic__table-heading--opt-out"> Fravalgt </span>
        </div>
      </div>
    </div>

    <div class="epic__table">
      <Task
        v-for="task in tasksForEpic"
        :key="task.id"
        :data="task"
        @click="detailsStore.setDetails(task)"
        @update="handleTaskUpdate"
      />
    </div>

    <div class="epic__footer">
      <div class="epic__table-footer">
        <div class="epic__table-col epic__table-col--button">
          <Button
            class="new-task"
            text="Tilføj task"
            icon="icon-plus"
            @click="handleCreateTask"
          />
        </div>

        <!-- <div class="epic__table-col">
          <span class="epic__table-sum">
            I alt:
          </span>
        </div> -->

        <div class="epic__table-col">
          <span class="epic__table-sum--estimate">
            {{ totalEstimatedHours.toFixed(2).replace(".", ",") }}
          </span>
        </div>

        <div class="epic__table-footer--realistic">
          <div class="epic__table-col">
            <span class="epic__table-sum--hours">
              {{ totalRealisticHours.toFixed(2).replace(".", ",") }}
            </span>
          </div>

          <div class="epic__table-col">
            <span class="epic__table-sum--price">
              {{
                numberDotSeperator(
                  totalRealisticPrice.toFixed(2).replace(".", ",")
                )
              }}
            </span>
          </div>
        </div>

        <div class="epic__table-footer--pessimistic">
          <div class="epic__table-col">
            <span class="epic__table-sum--hours">
              {{ totalPessimisticHours.toFixed(2).replace(".", ",") }}
            </span>
          </div>

          <div class="epic__table-col">
            <span class="epic__table-sum--price">
              {{
                numberDotSeperator(
                  totalPessimisticPrice.toFixed(2).replace(".", ",")
                )
              }}
            </span>
          </div>
        </div>
      </div>

      <div class="epic__divider"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.epic {
  &__table {
    display: grid;
    gap: var(--table-gap);

    &-col {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: var(--table-columns-padding);

      &--button {
        display: block;
      }
    }

    &-header,
    &-footer {
      width: 100%;
      display: grid;
      grid-template-columns: var(--table-columns);
      // gap: var(--table-gap);
      color: var(--font-color-primary);
      font-weight: 600;

      span {
        display: block;
      }
    }

    &-header {
      padding-right: calc(
        var(--width-icon) + var(--table-columns-padding) / 2 +
          var(--input-padding) / 2
      );

      &--realistic,
      &--pessimistic {
        display: flex;
        grid-column: span 2;
        position: relative;
      }
      &--realistic {
        &::before {
          content: "Realistisk";
          position: absolute;
          bottom: 45px;
          width: 100%;
          display: flex;
          justify-content: center;
          opacity: 0.5;
        }
      }
      &--pessimistic {
        &::before {
          content: "Pessimistisk";
          position: absolute;
          bottom: 45px;
          width: 100%;
          display: flex;
          justify-content: center;
          opacity: 0.5;
        }
      }
    }

    &-footer {
      padding-right: calc(
        var(--width-icon) + var(--width-opt-out) + var(--table-columns-padding) *
          2.5 + var(--input-padding) / 2
      );
      padding-top: var(--table-gap);

      &--realistic,
      &--pessimistic {
        display: flex;
        grid-column: span 2;
        color: var(--font-color-secondary);
      }
      &--realistic {
        background-color: var(--color-realistic);
        // color: var(--color-realistic);
      }
      &--pessimistic {
        background-color: var(--color-pessimistic);
        // color: var(--color-pessimistic);
      }
    }

    &-heading,
    &-sum {
      &--name {
        width: 100%;
        padding-left: var(--input-padding);
      }
      &--risk {
        width: var(--width-risk);
        padding-left: var(--input-padding);
      }
      &--role {
        width: var(--width-role);
        padding-left: var(--input-padding);
      }
      &--estimate {
        width: var(--width-estimate);
        text-align: right;
        padding-right: var(--input-padding);
      }
      &--hours {
        width: var(--width-hours);
        text-align: right;
        margin: var(--input-padding);
      }
      &--price {
        width: var(--width-price);
        text-align: right;
        margin: var(--input-padding);
      }
      &--opt-out {
        width: var(--width-opt-out);
        text-align: center;
      }
    }

    // &--sum {
    //   text-align: right;
    //   width: var(--width-role);
    // }
  }

  &__header {
    padding-top: 25px;
    position: sticky;
    top: -20px;
    background: var(--color-background);
    z-index: 1;
    .flex {
      display: flex;
    }
    .flex,
    .epic__opted-out {
      padding-left: calc(var(--table-columns-padding) + var(--input-padding));
    }
    .epic__name {
      font-size: 2rem;
    }
    .epic__opted-out {
      display: block;
      color: var(--color-disabled);
      margin-bottom: 20px;
    }
  }

  &__footer {
    position: sticky;
    bottom: -20px;
    background: var(--color-background);
    z-index: 2;
  }

  &__divider {
    margin-top: 50px;
    height: 1px;
    width: 100%;
    background-color: var(--color-tabs);
    opacity: 0.25;
  }
}
</style>
