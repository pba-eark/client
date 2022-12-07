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

/* Profile */
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
};

const handleCreateProfile = (obj, settingType) => {

  if (settingType == "globalSetting") {
    newRiskProfile.global = true;
  };

  riskProfileStore.createRiskProfile(obj);
};

/* Role */
const handleUpdateRole = (obj, prop) => {
  switch (prop) {
    case "name":
      obj.roleName = input.value;
      break;
    case "wage":
      obj.hourlyWage = input.value;
      break;
    case "global":
      obj.global = input.value;
      break;
    case "default":
      obj.default = input.value;
  };

  roleStore.updateRole(obj);
};

const newRole = {
  global: false,
  default: false,
  roleName: "Ny Rolle",
  hourlyWage: 0
};

const handleCreateRole = (obj, settingType) => {

  if (settingType == "globalSetting") {
    newRole.global = true
  }

  roleStore.createRole(obj);
};

/* SheetStatus */
const handleUpdateSheetStatus = (obj, prop) => {
  switch (prop) {
    case "name":
      obj.sheetStatusName = input.value;
      break;
    case "global":
      obj.global = input.value;
      break;
    case "default":
      obj.default = input.value;
  };

  roleStore.updateRole(obj);
};

const newSheetStatus = {
  global: false,
  default: true,
  sheetStatusName: "Ny Status"
};

const handleCreateSheetStatus = (obj, settingType) => {

  if (settingType == "globalSetting") {
    newSheetStatus.global = true
  }

  sheetStatusStore.createSheetStatus(obj);
};

/* EpicStatus */
const handleUpdateEpicStatus = (obj, prop) => {
  switch (prop) {
    case "name":
      obj.sheetStatusName = input.value;
      break;
    case "global":
      obj.global = input.value;
      break;
    case "default":
      obj.default = input.value;
  };

  roleStore.updateRole(obj);
};

const newEpicStatus = {
  global: false,
  default: true,
  epicStatusName: "Ny Status"
};

const handleCreateEpicStatus = (obj) => {

  if (settingType == "globalSetting") {
    newEpicStatus.global = true
  }

  epicStatusStore.createEpicStatus(obj);
};


//let settingsView = false;


</script>

<template>
  <div>


    <!-- <Button text="Lokale Indstillinger" @Click="settingsView = false" />
    <Button text="Globale Indstillinger" @Click="settingsView = true" /> -->


    <div>
      <h2>Lokal</h2>

      <h3>Risikoprofiler</h3>
      <div v-for="riskProfile in riskProfileStore.RISK_PROFILES" :key="riskProfile.id">
        <div v-if="!riskProfile.global">
          <Input @change="handleUpdateProfile(riskProfile, 'name')" v-model="input"
            :default="riskProfile.profileName" />
          <Input @change="handleUpdateProfile(riskProfile, 'percentage')" v-model="input"
            :default="riskProfile.percentage || '0'" />
          <Input type="checkbox" @change="handleUpdateProfile(riskProfile, 'global')" v-model="input"
            :default="riskProfile.global" />
          <Input type="checkbox" @change="handleUpdateProfile(riskProfile, 'default')" v-model="input"
            :default="riskProfile.default" />
        </div>
      </div>
      <br>
      <Button text="Ny Profil" @Click="handleCreateProfile(newRiskProfile, 'globalSetting')" />
      <br>

      <h3>Roller</h3>
      <div v-for="role in roleStore.ROLES" :key="role.id">
        <div v-if="!role.global">
          <Input @change="handleUpdateRole(role, 'name')" v-model="input" :default="role.roleName" />
          <Input @change="handleUpdateRole(role, 'wage')" v-model="input" :default="role.hourlyWage || '0'" />
          <Input type="checkbox" @change="handleUpdateRole(role, 'global')" v-model="input" :default="role.global" />
          <Input type="checkbox" @change="handleUpdateRole(role, 'default')" v-model="input" :default="role.default" />
        </div>
      </div>
      <br>
      <Button text="Ny Rolle" @Click="handleCreateRole(newRole, 'globalSetting')" />
      <br>

      <h3>Ark status</h3>
      <div v-for="sheetStatus in sheetStatusStore.SHEET_STATUS" :key="sheetStatus.id">
        <div v-if="!sheetStatus.global">
          <Input @change="handleUpdateSheetStatus(sheetStatus, 'name')" v-model="input"
            :default="sheetStatus.sheetStatusName" />
          <Input type="checkbox" @change="handleUpdateSheetStatus(sheetStatus, 'global')" v-model="input"
            :default="role.global" />
          <Input type="checkbox" @change="handleUpdateSheetStatus(sheetStatus, 'default')" v-model="input"
            :default="role.default" />
        </div>
      </div>
      <br>
      <Button text="Ny Status" @Click="handleCreateSheetStatus(newSheetStatus, 'globalSetting')" />
      <br>

      <h3>Epic status</h3>
      <div v-for="epicStatus in epicStatusStore.EPIC_STATUS" :key="epicStatus.id">
        <div v-if="!epicStatus.global">
          <Input @change="handleUpdateEpicStatus(epicStatus, 'name')" v-model="input"
            :default="epicStatus.epicStatusName" />
          <Input type="checkbox" @change="handleUpdateEpicStatus(epicStatus, 'global')" v-model="input"
            :default="role.global" />
          <Input type="checkbox" @change="handleUpdateEpicStatus(epicStatus, 'default')" v-model="input"
            :default="role.default" />
        </div>
      </div>
      <br>
      <Button text="Ny Status" @Click="handleCreateEpicStatus(newEpicStatus, 'globalSetting')" />
      <br>
    </div>






    <div>
      <h2>Global</h2>

      <h3>Risikoprofiler</h3>
      <div v-for="riskProfile in riskProfileStore.RISK_PROFILES" :key="riskProfile.id">
        <div v-if="riskProfile.global">
          <Input @change="handleUpdateProfile(riskProfile, 'name')" v-model="input"
            :default="riskProfile.profileName" />
          <Input @change="handleUpdateProfile(riskProfile, 'percentage')" v-model="input"
            :default="riskProfile.percentage || '0'" />
          <Input type="checkbox" @change="handleUpdateProfile(riskProfile, 'global')" v-model="input"
            :default="riskProfile.global" />
          <Input type="checkbox" @change="handleUpdateProfile(riskProfile, 'default')" v-model="input"
            :default="riskProfile.default" />
        </div>
      </div>
      <br>
      <Button text="Ny Profil" @Click="handleCreateProfile(newRiskProfile, 'globalSetting')" />
      <br>

      <h3>Roller</h3>
      <div v-for="role in roleStore.ROLES" :key="role.id">
        <div v-if="role.global">
          <Input @change="handleUpdateRole(role, 'name')" v-model="input" :default="role.roleName" />
          <Input @change="handleUpdateRole(role, 'wage')" v-model="input" :default="role.hourlyWage || '0'" />
          <Input type="checkbox" @change="handleUpdateRole(role, 'global')" v-model="input" :default="role.global" />
          <Input type="checkbox" @change="handleUpdateRole(role, 'default')" v-model="input" :default="role.default" />
        </div>
      </div>
      <br>
      <Button text="Ny Rolle" @Click="handleCreateRole(newRole, 'globalSetting')" />
      <br>

      <h3>Ark status</h3>
      <div v-for="sheetStatus in sheetStatusStore.SHEET_STATUS" :key="sheetStatus.id">
        <div v-if="sheetStatus.global">
          <Input @change="handleUpdateSheetStatus(sheetStatus, 'name')" v-model="input"
            :default="sheetStatus.sheetStatusName" />
          <Input type="checkbox" @change="handleUpdateSheetStatus(sheetStatus, 'global')" v-model="input"
            :default="role.global" />
          <Input type="checkbox" @change="handleUpdateSheetStatus(sheetStatus, 'default')" v-model="input"
            :default="role.default" />
        </div>
      </div>
      <br>
      <Button text="Ny Status" @Click="handleCreateSheetStatus(newSheetStatus, 'globalSetting')" />
      <br>

      <h3>Epic status</h3>
      <div v-for="epicStatus in epicStatusStore.EPIC_STATUS" :key="epicStatus.id">
        <div v-if="epicStatus.global">
          <Input @change="handleUpdateEpicStatus(epicStatus, 'name')" v-model="input"
            :default="epicStatus.epicStatusName" />
          <Input type="checkbox" @change="handleUpdateEpicStatus(epicStatus, 'global')" v-model="input"
            :default="role.global" />
          <Input type="checkbox" @change="handleUpdateEpicStatus(epicStatus, 'default')" v-model="input"
            :default="role.default" />
        </div>
      </div>
      <br>
      <Button text="Ny Status" @Click="handleCreateEpicStatus(newEpicStatus, 'globalSetting')" />
      <br>
    </div>



  </div>
</template>