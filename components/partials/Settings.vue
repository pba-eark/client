<script setup>

import { useRiskProfileStore } from "~~/store/riskProfiles";
import { useEstimateSheetRiskProfileStore } from "~~/store/composites/estimateSheetRiskProfiles";
import { useRoleStore } from "~~/store/roles";
import { useTaskStore } from "~~/store/tasks";
import { useEpicStore } from "~~/store/epics";
import { useSheetStatusStore } from "~~/store/sheetStatus";
import { useEpicStatusStore } from "~~/store/epicStatus";
import { useEstimateSheetRoleStore } from "~~/store/composites/estimateSheetRoles";
import { useEstimateSheetStore } from "~~/store/estimateSheets";
import { typeCheck } from "~~/helpers/functions";


const riskProfileStore = useRiskProfileStore();
const estimateSheetRiskProfileStore = useEstimateSheetRiskProfileStore();
const roleStore = useRoleStore();
const taskStore = useTaskStore();
const epicStore = useEpicStore();
const sheetStatusStore = useSheetStatusStore();
const epicStatusStore = useEpicStatusStore();
const estimateSheetRoleStore = useEstimateSheetRoleStore();
const estimateSheetStore = useEstimateSheetStore();

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

  console.log("first sheetProfiles", sheetProfiles.value)
});

riskProfileStore.RISK_PROFILES.forEach(element => {
  if (element.global) {
    masterGlobals.value.push(element);
  }
});

let indexes = [];

masterGlobals.value.forEach(masterGlobal => {

  //let indexToSplice = 0;

  sheetProfiles.value.forEach(sheetProfile => {

    const index = sheetProfiles.value.findIndex(
      (profile) => profile.profileName == masterGlobal.profileName
    );

    console.log(sheetProfile.profileName, masterGlobal.profileName)

    if (index >= 0 && sheetProfile.profileName == masterGlobal.profileName) {
      console.log(sheetProfile)
      globals.value = [...globals.value, sheetProfile]
      //globals.value.push(sheetProfile);
      indexes.push(index);
      // indexToSplice = index;
      console.log("building globals", globals.value)
      // console.log(index)
    }

  });

  // globals.value.splice(indexToSplice, 1);

});

indexes.sort(function(a, b){return b - a});

indexes.forEach(index => {
  globals.value.splice(index, 1);
});

// console.log("sheetProfiles", sheetProfiles.value)
// console.log("master", masterGlobals.value)
// console.log("globals", globals.value)

const newProfile = {
  global: false,
  default: false,
  profileName: "Ny Profil",
  percentage: 0
};

const newSheetLink = ref({
  estimateSheetId: props.sheetId,
  riskProfileId: 0
});

const handleCreateProfile = async (settingType) => {

  if (settingType == 'local') {
    let profile = await riskProfileStore.createRiskProfile(newProfile);
    newSheetLink.value.riskProfileId = profile.id;
    await estimateSheetRiskProfileStore.createEstimateSheetRiskProfile(newSheetLink.value);
    sheetProfiles.value.push(profile);
  }
  else if (settingType == 'global') {
    newProfile.global = true;

    let profile = await riskProfileStore.createRiskProfile(newProfile);

    estimateSheetStore.ESTIMATE_SHEETS.forEach(async sheet => {

      newSheetLink.value.estimateSheetId = sheet.id;
      newSheetLink.value.riskProfileId = profile.id;
      await estimateSheetRiskProfileStore.createEstimateSheetRiskProfile(newSheetLink.value);

    });
    masterGlobals.value.push(profile);
  }

};

const handleUpdateGlobalProfile = async (profile, originalProfile) => {
  // create ny profile som ikke er global 
  // for hver sheet i storen
  // opdater composite tabel med ny profil 
  // Gør så alle sheets har en lokalglobal profil
  // Sheets har her både den globale og den lokalglobale profil
  // opdater den originale profile med ny info, eller slet den og stop
  // hvis profilerne har samme navn, men ikke samme procentsats, burde der være en lokalglobal med en anden procentværdig end den under globale settings
  // hvis profilerne har same procentsats, men ikke samme navn, burde der være en lokal profil men den globalelokale er væk, da task felterne der brugte den nu bruger den nye lokale profil

  //riskProfileStore.updateRiskProfile(profile);


  // hvis procentsatsen er ændret skal man lave en ny profil
  // lav et link til den nye profil for hvert sheet
  // 
  console.log("new", profile.percentage, "old", originalProfile.percentage)
  if (profile.percentage != originalProfile.percentage) {

    newProfile.global = false;
    newProfile.profileName = profile.profileName;
    newProfile.percentage = profile.percentage;

    let riskProfile = await riskProfileStore.createRiskProfile(newProfile);

    estimateSheetStore.ESTIMATE_SHEETS.forEach(async sheet => {
      newSheetLink.value.estimateSheetId = sheet.id;
      newSheetLink.value.riskProfileId = riskProfile.id;
      await estimateSheetRiskProfileStore.createEstimateSheetRiskProfile(newSheetLink.value);
    });

    await riskProfileStore.updateRiskProfile(profile, originalProfile);

  } else {

    let result = riskProfileStore.updateRiskProfile(profile);

    masterGlobals.value.map((updatedProfile) => {
      if (updatedProfile.id === typeCheck(profile.id)) Object.assign(updatedProfile, result);
    });
  }
};

const handleDeleteProfile = async (id) => {

  await riskProfileStore.deleteRiskProfile(id);

  const profileIndex = sheetProfiles.value.findIndex(
    (obj) => obj.id === id
  );

  sheetProfiles.value.splice(profileIndex, 1);

};

const handleDeleteGlobalProfile = async (profile) => {
  newProfile.global = false;
  newProfile.profileName = profile.profileName;
  newProfile.percentage = profile.percentage;

  let riskProfile = await riskProfileStore.createRiskProfile(newProfile);

  estimateSheetStore.ESTIMATE_SHEETS.forEach(async sheet => {
    newSheetLink.value.estimateSheetId = sheet.id;
    newSheetLink.value.riskProfileId = riskProfile.id;
    await estimateSheetRiskProfileStore.createEstimateSheetRiskProfile(newSheetLink.value);

    if (sheet.id == props.sheetId) {
      sheetProfiles.value.push(newProfile);
    }
  });

  await riskProfileStore.deleteRiskProfile(profile.id);

  const profileIndex = masterGlobals.value.findIndex(
    (obj) => obj.id === profile.id
  );

  masterGlobals.value.splice(profileIndex, 1);
}

// #endregion

// #region Role
/* Role */
const sheetRoles = ref([]);
const globalMasterRoles = ref([]);
const globalRoles = ref([]);

roleStore.ROLES.forEach(element => {

  estimateSheetRoleStore.ESTIMATE_SHEET_ROLES.forEach(item => {
    if (element.id == item.roleId && props.sheetId == item.estimateSheetId) {
      sheetRoles.value.push(element);
    }
  });
});

roleStore.ROLES.forEach(role => {
  sheetRoles.value.forEach(sheetRole => {
    if (role.id == sheetRole.id && !sheetRoles.value.includes(role)) {
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

const newLokalRole = {
  global: false,
  default: false,
  roleName: "Ny Rolle",
  hourlyWage: 0
};

const newSheetRoleLink = ref({
  estimateSheetId: props.sheetId,
  roleId: 0
});

const handleCreateRole = async () => {
  let newRole = await roleStore.createRole(newLokalRole);
  newSheetRoleLink.value.roleId = newRole.id;
  await estimateSheetRoleStore.createEstimateSheetRole(newSheetRoleLink.value);
  sheetRoles.value.push(newRole);
};

const handleDeleteRole = (id) => {

  roleStore.deleteRole(id);

  const profileIndex = sheetRoles.value.findIndex(
    (obj) => obj.id === id
  );

  sheetRoles.value.splice(profileIndex, 1);
};
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
      <Button text="New Profile" @Click="handleCreateProfile('local')" />

      <h3>Roller</h3>
      <div v-for="role in globalRoles" :key="role.id">
        <LocalGlobalSettings :data="role" :renderForm="'role'" @delete="handleDeleteRole" />
      </div>
      <p>-----------------------------</p>
      <div v-for="role in sheetRoles" :key="role.id">
        <LocalSettings :data="role" :renderForm="'role'" @delete="handleDeleteRole" />
      </div>
      <Button text="New Role" @Click="handleCreateRole" />

    </div>

    <div v-if="!localSettingsTab">
      <h2>Global</h2>

      <h3>Risikoprofiler</h3>
      <div v-for="profile in masterGlobals" :key="profile.id">
        <GlobalSettings :data="profile" :renderForm="'riskProfile'" @delete="handleDeleteGlobalProfile"
          @update="handleUpdateGlobalProfile" />
      </div>
      <Button text="New Profile" @Click="handleCreateProfile('global')" />

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