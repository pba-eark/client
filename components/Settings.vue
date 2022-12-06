<script setup>

import { useRiskProfileStore } from "~~/store/riskProfiles";
import { useRoleStore } from "~~/store/roles";
import { useSheetStatusStore } from "~~/store/sheetStatus";
import { useEpicStatusStore } from "~~/store/epicStatus";

const riskProfileStore = useRiskProfileStore();
const roleStore = useRoleStore();
const sheetStatusStore = useSheetStatusStore();
const epicStatusStore = useEpicStatusStore();

const input = ref(null)

const handleUpdateProfile = (obj, prop) => {
  switch (prop) {
    case "name":
      obj.profileName = input.value;
      break;
    case "percentage":
      obj.percentage = input.value;
      break;
    case "global":
      obj.global = input.value;
      break;
    case "default":
      obj.default = input.value;
  };

  riskProfileStore.updateRiskProfile(obj);
};

const newRiskProfile = {
  global: false,
  default: false,
  profileName: "Ny profil",
  percentage: 0
}

const handleCraeteProfile = (obj) => {
  riskProfileStore.createRiskProfile(obj);
}

</script>

<template>
  <div>

    <div>
      <h2>Global</h2>
      <h3>Risikoprofiler</h3>
      <div v-for="riskProfile in riskProfileStore.RISK_PROFILES" :key="riskProfile.id">
        <div v-if="riskProfile.global">
          <Input @change="handleUpdateProfile(riskProfile, 'name')" v-model="input"
            :default="riskProfile.profileName" />
          <Input @change="handleUpdateProfile(riskProfile, 'percentage')" v-model="input"
            :default="riskProfile.percentage" />
          <Input type="checkbox" @change="handleUpdateProfile(riskProfile, 'global')" v-model="input"
            :default="riskProfile.global" />
          <Input type="checkbox" @change="handleUpdateProfile(riskProfile, 'default')" v-model="input"
            :default="riskProfile.default" />
        </div>
      </div>
      <br>
      <Button text="Ny Profil" @Click="handleCraeteProfile(newRiskProfile)" />
      <br>

      <h3>Roller</h3>
      <div v-for="role in roleStore.ROLES" :key="role.id">
        <div v-if="role.global">
          <Input :default="role.roleName" />
          <Input :default="role.hourlyWage" />
        </div>
      </div>
      <br>
      <Button text="Ny Profil" @Click="handleCraeteProfile(newRiskProfile)" />
      <br>

      <h3>Ark status</h3>
      <div v-for="sheetStatus in sheetStatusStore.SHEET_STATUS" :key="sheetStatus.id">
        <div v-if="sheetStatus.global">
          <Input :default="sheetStatus.sheetStatusName" />
        </div>
      </div>

      <h3>Epic status</h3>
      <div v-for="epicStatus in epicStatusStore.EPIC_STATUS" :key="epicStatus.id">
        <div v-if="epicStatus.global">
          <Input :default="epicStatus.epicStatusName" /> 
        </div>
      </div>



      <h2>Lokal</h2>
      <h3>Risikoprofiler</h3>
      <div v-for="riskProfile in riskProfileStore.RISK_PROFILES" :key="riskProfile.id">
        <div v-if="!riskProfile.global">
          <Input @change="handleUpdateProfile(riskProfile, 'name')" v-model="input"
            :default="riskProfile.profileName" />
          <Input type="number" @change="handleUpdateProfile(riskProfile, 'percentage')" v-model="input"
            :default="(riskProfile.percentage ? riskProfile.percentage : '0')" />
          <Input type="checkbox" @change="handleUpdateProfile(riskProfile, 'global')" v-model="input"
            :default="riskProfile.global" />
          <Input type="checkbox" @change="handleUpdateProfile(riskProfile, 'default')" v-model="input"
            :default="riskProfile.default" />
        </div>
      </div>
      <br>

      <h3>Roller</h3>
      <div v-for="role in roleStore.ROLES" :key="role.id">
        <div v-if="!role.global">
          <Input :default="role.roleName" />
          <Input :default="role.hourlyWage" />
        </div>
      </div>
      <br>

      <h3>Ark status</h3>
      <div v-for="sheetStatus in sheetStatusStore.SHEET_STATUS" :key="sheetStatus.id">
        <div v-if="!sheetStatus.global">
          <Input :default="sheetStatus.sheetStatusName" />
        </div>
      </div>

      <h3>Epic status</h3>
      <div v-for="epicStatus in epicStatusStore.EPIC_STATUS" :key="epicStatus.id">
        <div v-if="!epicStatus.global">
          <Input :default="epicStatus.epicStatusName" /> 
        </div>
      </div>

    </div>







  </div>
</template>