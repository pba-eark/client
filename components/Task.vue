<script setup>
import { useTaskStore } from "~/store/tasks";
import { useRoleStore } from "~/store/roles";
import { useRiskProfileStore } from "~/store/riskProfiles";

const taskStore = useTaskStore();
const roleStore = useRoleStore();
const riskProfileStore = useRiskProfileStore();

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

let hoursRealistic = 2.25;
let priceRealistic = 1125.0;
let hoursPessimistic = 2.5;
let pricePessimistic = 1250.0;

const handleUpdateTaskName = (val) => {
  props.data.taskName = val;
  taskStore.updateTask(props.data);
};

const handleUpdateEstimate = (val) => {
  if (val.includes(",")) val = val.replace(",", ".");
  val = parseFloat(val).toFixed(2);

  props.data.hourEstimate = val;
  taskStore.updateTask(props.data);
};

const handleUpdateRiskProfile = ({ id }) => {
  props.data.riskProfileId = id;
  taskStore.updateTask(props.data);
};

const handleUpdateRole = ({ id }) => {
  props.data.roleId = id;
  taskStore.updateTask(props.data);
};

const roleOptions = computed(() => {
  return roleStore.ROLES.map((role) => {
    return { id: role.id, name: role.roleName };
  });
});

const riskProfileOptions = computed(() => {
  return riskProfileStore.RISK_PROFILES.map((riskProfile) => {
    return { id: riskProfile.id, name: riskProfile.profileName };
  });
});

const currentRiskProfile = computed(() => {
  return riskProfileStore.RISK_PROFILES.filter((riskProfile) => {
    return riskProfile.id == props.data.riskProfileId;
  });
});

const currentRole = computed(() => {
  return roleStore.ROLES.filter((role) => {
    return role.id == props.data.roleId;
  });
});

const currentEstimate = computed(() => {
  return parseFloat(props.data.hourEstimate).toFixed(2).replace(".", ",");
});
</script>

<template>
  <div class="task__row" :class="{ 'task--disabled': props.data.optOut }">
    <div class="task__col">
      <Input
        :default="props.data.taskName"
        emit="updateTaskName"
        @updateTaskName="handleUpdateTaskName"
      />
    </div>

    <div class="task__col">
      <Input
        type="select"
        :options="riskProfileOptions"
        emit="updateRiskProfile"
        :placeholder="currentRiskProfile[0].profileName"
        @updateRiskProfile="handleUpdateRiskProfile"
      />
    </div>

    <div class="task__col">
      <Input
        type="select"
        :placeholder="
          currentRole[0]?.roleName ? currentRole[0].roleName : 'Vælg rolle'
        "
        :options="roleOptions"
        emit="updateRole"
        @updateRole="handleUpdateRole"
      />
    </div>

    <div class="task__col task--number">
      <Input
        class="number"
        :default="currentEstimate"
        emit="updateEstimate"
        @updateEstimate="handleUpdateEstimate"
      />
    </div>

    <div class="task__col task--number task--realistic">
      {{ hoursRealistic }}
    </div>

    <div class="task__col task--number task--realistic">
      {{ priceRealistic }}
    </div>

    <div class="task__col task--number task--pessimistic">
      {{ hoursPessimistic }}
    </div>

    <div class="task__col task--number task--pessimistic">
      {{ pricePessimistic }}
    </div>

    <div class="task__col task--checkbox">
      <Input
        type="checkbox"
        v-model="props.data.optOut"
        @change="taskStore.updateTask(props.data)"
        :default="props.data.optOut"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.task {
  &__row {
    width: 100%;
    display: grid;
    grid-template-columns: auto 100px 200px 70px 70px 100px 70px 100px 75px;
    gap: 3px;
  }

  &--disabled {
    background: red;
    .task__col {
      background: red;
    }
  }

  &__col {
    background-color: white;
    color: black;
    padding: 5px;
  }

  &--number {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
  }

  &--checkbox {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &--realistic {
    background-color: green;
    color: white;
    padding: 10px;
  }

  &--pessimistic {
    background-color: blue;
    color: white;
    padding: 10px;
  }
}
</style>
