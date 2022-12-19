<script setup>
import { useRiskProfileStore } from "~~/store/riskProfiles";

const riskProfileStore = useRiskProfileStore();

const input = ref(null);

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  renderForm: {
    type: String,
    required: true,
  },
});

/* Profile */
const handleCreateProfile = (obj) => {
  riskProfileStore.createRiskProfile(obj);
};

const newRole = {
  global: false,
  default: false,
  roleName: "Ny Rolle",
  hourlyWage: 0,
};

const handleCreateRole = (obj, settingType) => {
  if (settingType == "globalSetting") {
    newRole.global = true;
  }

  roleStore.createRole(obj);
};

let disabled = ref(true);
let writePercentageField = ref(false);
let writePercentage = null;

const useGlobalValue = () => {
  writePercentageField.value = !writePercentageField.value;
  writePercentage = null;
};
</script>

<template>
  <div>
    <div>
      <br />

      <form v-if="props.renderForm == 'riskProfile'">
        <p>"icon" Profil Navn</p>
        <p>{{ props.data.profileName }}</p>
        <p>{{ props.data.percentage }}</p>
        <Button v-if="disabled" text="Edit" @click="disabled = false" />
        <div v-if="!disabled">
          <p>Benyt Global Værdi</p>
          <p>{{ props.data.percentage }}%</p>
          <input type="checkbox" @change="useGlobalValue" />
          <input
            type="text"
            :disabled="writePercentageField"
            v-model="writePercentage"
          />
          <Button text="Save" @click="handleCreateProfile(props.data)" />
          <Button text="Unsave" @click="disabled = true" />
        </div>
      </form>

      <br />

      <form v-if="props.renderForm == 'role'">
        <p>"icon" Rolle Navn</p>
        <p>{{ props.data.roleName }}</p>
        <p>{{ props.data.hourlyWage }}</p>
        <Button v-if="disabled" text="Edit" @click="disabled = false" />
        <div v-if="!disabled">
          <p>Benyt Global Værdi</p>
          <p>{{ props.data.hourlyWage }}kr</p>
          <input type="checkbox" @change="useGlobalValue" />
          <input
            type="text"
            :disabled="writePercentageField"
            v-model="writePercentage"
          />
          <Button text="Save" @click="handleCreateRole(props.data)" />
          <Button text="Unsave" @click="disabled = true" />
        </div>
      </form>

      <br />

      <form v-if="props.renderForm == 'sheetStatus'">
        <p>Status Navn</p>
        <p>{{ props.data.sheetStatusName }}</p>
      </form>
    </div>
  </div>
</template>
