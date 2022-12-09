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

/* SheetStatus */
const globalMasterSheetStatus = ref([]);

sheetStatusStore.SHEET_STATUS.forEach(status => {
  globalMasterSheetStatus.value.push(status);
});

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
        <LocalSettings :data="riskProfile" :renderForm="'riskProfile'" />
      </div>


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

      


      <!-- <h2>Global</h2>

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
            :default="sheetStatus.global" />
          <Input type="checkbox" @change="handleUpdateSheetStatus(sheetStatus, 'default')" v-model="input"
            :default="sheetStatus.default" />
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
            :default="epicStatus.global" />
          <Input type="checkbox" @change="handleUpdateEpicStatus(epicStatus, 'default')" v-model="input"
            :default="epicStatus.default" />
        </div>
      </div>
      <br>
      <Button text="Ny Status" @Click="handleCreateEpicStatus(newEpicStatus, 'globalSetting')" />
      <br> -->
    </div>



  </div>
</template>