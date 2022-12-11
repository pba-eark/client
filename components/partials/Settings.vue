<script setup>

import { useRiskProfileStore } from "~~/store/riskProfiles";
import { useEstimateSheetRiskProfileStore } from "~~/store/composites/estimateSheetRiskProfiles";
import { useRoleStore } from "~~/store/roles";
import { useTaskStore } from "~~/store/tasks";
import { useEpicStore } from "~~/store/epics";
import { useSheetStatusStore } from "~~/store/sheetStatus";
import { useEpicStatusStore } from "~~/store/epicStatus";


const riskProfileStore = useRiskProfileStore();
const estimateSheetRiskProfileStore = useEstimateSheetRiskProfileStore();
const roleStore = useRoleStore();
const taskStore = useTaskStore();
const epicStore = useEpicStore();
const sheetStatusStore = useSheetStatusStore();
const epicStatusStore = useEpicStatusStore();

const props = defineProps({
  sheetId: {
    type: Number,
    required: true
  },
});

const localSettingsTab = ref(true)

// #region Profile
/* Profile */
const sheetProfiles = ref([]);
const masterGlobals = ref([]);
const globals = ref([]);

riskProfileStore.RISK_PROFILES.forEach(element => {

  estimateSheetRiskProfileStore.ESTIMATE_SHEET_RISK_PROFILES.forEach(item => {
    if (element.id == item.riskProfileId && props.sheetId == item.estimateSheetId) {
      sheetProfiles.value.push(element);
    }
  });
});

riskProfileStore.RISK_PROFILES.forEach(element => {
  if (element.global) {
    masterGlobals.value.push(element);
  }
});

masterGlobals.value.forEach(masterGlobal => {

  let indexToSplice = 0;

  sheetProfiles.value.forEach(sheetProfile => {

    const index = sheetProfiles.value.findIndex(
      (profile) => profile.profileName == masterGlobal.profileName
    );

    if (index >= 0 && sheetProfile.profileName == masterGlobal.profileName) {
      globals.value.push(sheetProfile);
      indexToSplice = index;
    }

  });

  sheetProfiles.value.splice(indexToSplice, 1);

});

const newLokalProfile = {
  global: false,
  default: false,
  profileName: "Ny Profil",
  percentage: 0
};

const newSheetLink = ref({
  estimateSheetId: props.sheetId,
  riskProfileId: 0
});

const handleCreateProfile = async () => {
  let newProfile = await riskProfileStore.createRiskProfile(newLokalProfile);
  newSheetLink.value.riskProfileId = newProfile.id;
  await estimateSheetRiskProfileStore.createEstimateSheetRiskProfile(newSheetLink.value);
  sheetProfiles.value.push(newProfile);
};

const handleDeleteProfile = (id) => {
  
    riskProfileStore.deleteRiskProfile(id);

    const profileIndex = sheetProfiles.value.findIndex(
    (obj) => obj.id === id
  );

  sheetProfiles.value.splice(profileIndex, 1);
};

// #endregion

// #region Role
/* Role */
const sheetTasks = ref([]);
const sheetEpics = ref([]);
const sheetRoles = ref([]);
const globalMasterRoles = ref([]);
const globalRoles = ref([]);

epicStore.EPICS.forEach(epic => {
  if (epic.estimateSheetId == props.sheetId) {
    sheetEpics.value.push(epic);
  }
});

taskStore.TASKS.forEach(task => {
  sheetEpics.value.forEach(epic => {
    if (task.epicId == epic.id) {
      sheetTasks.value.push(task)
    }
  });
});

roleStore.ROLES.forEach(role => {
  sheetTasks.value.forEach(task => {
    if (role.id == task.roleId && !sheetRoles.value.includes(role)) {
      sheetRoles.value.push(role)
    }
  });
});

roleStore.ROLES.forEach(role => {
  if (role.global) {
    globalMasterRoles.value.push(role);
  }
});

globalMasterRoles.value.forEach(masterRole => {

  let indexToSplice = 0;

  sheetRoles.value.forEach(sheetRole => {

    const index = sheetRoles.value.findIndex(
      (role) => role.roleName == masterRole.roleName
    );

    if (index >= 0 && sheetRole.roleName == masterRole.roleName) {
      globalRoles.value.push(sheetRole);
      indexToSplice = index;
    }

  });

  sheetRoles.value.splice(indexToSplice, 1);

});
// #endregion

// #region SheetStatus
/* SheetStatus */
const globalMasterSheetStatus = ref([]);

sheetStatusStore.SHEET_STATUS.forEach(status => {
  globalMasterSheetStatus.value.push(status);
});
// #endregion

</script>

<template>
  <div>

    <Button text="Lokale Indstillinger" @Click="localSettingsTab = true" />
    <Button text="Globale Indstillinger" @Click="localSettingsTab = false" />

    <div v-if="localSettingsTab">
      <h2>Lokal</h2>

      <h3>Risikoprofiler</h3>
      <div v-for="riskProfile in globals" :key="riskProfile.id">
        <LocalGlobalSettings :data="riskProfile" :renderForm="'riskProfile'" />
      </div>
      <p>-----------------------------</p>
      <div v-for="riskProfile in sheetProfiles" :key="riskProfile.id">
        <LocalSettings :data="riskProfile" :renderForm="'riskProfile'" @delete="handleDeleteProfile" />
      </div>
      <Button text="New Profile" @Click="handleCreateProfile" />

      <h3>Roller</h3>
      <div v-for="role in globalRoles" :key="role.id">
        <LocalGlobalSettings :data="role" :renderForm="'role'" />
      </div>
      <p>-----------------------------</p>
      <div v-for="role in sheetRoles" :key="role.id">
        <LocalSettings :data="role" :renderForm="'role'" />
      </div>

    </div>

    <div v-if="!localSettingsTab">
      <h2>Global</h2>

      <h3>Risikoprofiler</h3>
      <div v-for="profile in masterGlobals" :key="profile.id">
        <GlobalSettings :data="profile" :renderForm="'riskProfile'" />
      </div>

      <h3>Roller</h3>
      <div v-for="role in globalMasterRoles" :key="role.id">
        <GlobalSettings :data="role" :renderForm="'role'" />
      </div>

      <h3>Sheet Status</h3>
      <div v-for="status in globalMasterSheetStatus" :key="status.id">
        <GlobalSettings :data="status" :renderForm="'sheetStatus'" />
      </div>
    </div>



  </div>
</template>