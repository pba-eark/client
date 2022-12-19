<script setup>
import { useRiskProfileStore } from "~~/store/riskProfiles";
import { useEstimateSheetRiskProfileStore } from "~~/store/composites/estimateSheetRiskProfiles";
import { useRoleStore } from "~~/store/roles";
import { useSheetStatusStore } from "~~/store/sheetStatus";
import { useEpicStatusStore } from "~~/store/epicStatus";
import { useEstimateSheetRoleStore } from "~~/store/composites/estimateSheetRoles";
import { useEstimateSheetStore } from "~~/store/estimateSheets";
import { typeCheck } from "~~/helpers/functions";

const riskProfileStore = useRiskProfileStore();
const estimateSheetRiskProfileStore = useEstimateSheetRiskProfileStore();
const roleStore = useRoleStore();
const sheetStatusStore = useSheetStatusStore();
const epicStatusStore = useEpicStatusStore();
const estimateSheetRoleStore = useEstimateSheetRoleStore();
const estimateSheetStore = useEstimateSheetStore();

const props = defineProps({
  sheetId: {
    type: Number,
    required: true,
  },
});

const newSheetLink = ref(null);
const newSheetRoleLink = ref(null);
const sheetRoles = ref([]);
const globalMasterRoles = ref([]);
const globalRoles = ref([]);
const globalMasterSheetStatus = ref([]);
const globalMasterEpicStatus = ref([]);
const localSettingsTab = ref(true);
const sheetProfiles = ref([]);
const masterGlobals = ref([]);
const globals = ref([]);

let onSheet = true;
const newProfile = {
  global: false,
  default: false,
  profileName: "Ny Profil",
  percentage: 0,
};
const newRole = {
  global: false,
  default: false,
  roleName: "Ny Rolle",
  hourlyWage: 0,
};
const newSheetStatus = {
  global: true,
  default: false,
  sheetStatusName: "New Status",
};
const newEpicStatus = {
  global: true,
  default: false,
  epicStatusName: "New Status",
};

if (isNaN(props.sheetId)) {
  onSheet = false;
}

/* Update on sheet change */
watch(
  () => props.sheetId,
  () => {
    getProfiles();
    getRoles();
    getSheetStatus();
    getEpicStatus();
  }
);

const getProfiles = () => {
  let indexes = [];
  sheetProfiles.value = [];
  masterGlobals.value = [];
  globals.value = [];
  riskProfileStore.RISK_PROFILES.forEach((element) => {
    estimateSheetRiskProfileStore.ESTIMATE_SHEET_RISK_PROFILES.forEach(
      (item) => {
        if (
          element.id == item.riskProfileId &&
          props.sheetId == item.estimateSheetId
        ) {
          sheetProfiles.value.push(element);
        }
      }
    );
  });

  riskProfileStore.RISK_PROFILES.forEach((element) => {
    if (element.global) {
      masterGlobals.value.push(element);
    }
  });

  masterGlobals.value.forEach((masterGlobal) => {
    sheetProfiles.value.forEach((sheetProfile) => {
      const index = sheetProfiles.value.findIndex(
        (profile) => profile.profileName == masterGlobal.profileName
      );

      if (index >= 0 && sheetProfile.profileName == masterGlobal.profileName) {
        globals.value.push(sheetProfile);
        indexes.push(index);
      }
    });
  });

  indexes.sort(function (a, b) {
    return b - a;
  });

  indexes.forEach((index) => {
    sheetProfiles.value.splice(index, 1);
  });

  newSheetLink.value = {
    estimateSheetId: props.sheetId,
    riskProfileId: 0,
  };
};

const handleCreateLocalProfile = async () => {
  let profile = await riskProfileStore.createRiskProfile(newProfile);
  newSheetLink.value.riskProfileId = profile.id;
  await estimateSheetRiskProfileStore.createEstimateSheetRiskProfile(
    newSheetLink.value
  );
  sheetProfiles.value.push(profile);
};

const handleCreateGlobalProfile = async () => {
  newProfile.global = true;

  let profile = await riskProfileStore.createRiskProfile(newProfile);

  estimateSheetStore.ESTIMATE_SHEETS.forEach(async (sheet) => {
    newSheetLink.value.estimateSheetId = sheet.id;
    newSheetLink.value.riskProfileId = profile.id;
    await estimateSheetRiskProfileStore.createEstimateSheetRiskProfile(
      newSheetLink.value
    );
  });
  globals.value.push(profile);
  masterGlobals.value.push(profile);
};

const handleUpdateGlobalProfile = async (profile, originalProfile) => {
  if (profile.percentage != originalProfile.percentage) {
    newProfile.global = false;
    newProfile.profileName = profile.profileName;
    newProfile.percentage = originalProfile.percentage;

    let riskProfile = await riskProfileStore.createRiskProfile(newProfile);

    globals.value.push(riskProfile);

    estimateSheetStore.ESTIMATE_SHEETS.forEach(async (sheet) => {
      newSheetLink.value.estimateSheetId = sheet.id;
      newSheetLink.value.riskProfileId = riskProfile.id;
      await estimateSheetRiskProfileStore.createEstimateSheetRiskProfile(
        newSheetLink.value
      );
    });

    globals.value.forEach((globalProfile) => {
      const index = globals.value.findIndex(
        (profile) => profile.profileName == originalProfile.profileName
      );

      if (
        index >= 0 &&
        globalProfile.profileName == originalProfile.profileName
      ) {
        globals.value.splice(index, 1);
      }
    });

    await riskProfileStore.updateRiskProfile(profile, originalProfile);
  } else {
    let response = await riskProfileStore.updateRiskProfile(profile);

    globals.value.map((updatedProfile) => {
      if (updatedProfile.id === typeCheck(profile.id))
        Object.assign(updatedProfile, response);
    });
  }
};

const handleDeleteLocalProfile = async (id) => {
  await riskProfileStore.deleteRiskProfile(id);

  const profileIndex = sheetProfiles.value.findIndex((obj) => obj.id === id);

  sheetProfiles.value.splice(profileIndex, 1);
};

const handleDeleteGlobalProfile = async (profile) => {
  newProfile.global = false;
  newProfile.profileName = profile.profileName;
  newProfile.percentage = profile.percentage;

  let riskProfile = await riskProfileStore.createRiskProfile(newProfile);

  estimateSheetStore.ESTIMATE_SHEETS.forEach(async (sheet) => {
    newSheetLink.value.estimateSheetId = sheet.id;
    newSheetLink.value.riskProfileId = riskProfile.id;
    await estimateSheetRiskProfileStore.createEstimateSheetRiskProfile(
      newSheetLink.value
    );

    if (sheet.id == props.sheetId) {
      sheetProfiles.value.push(newProfile);
    }
  });

  await riskProfileStore.deleteRiskProfile(profile.id);

  const profileIndex = masterGlobals.value.findIndex(
    (obj) => obj.id === profile.id
  );

  masterGlobals.value.splice(profileIndex, 1);
};

const getRoles = () => {
  sheetRoles.value = [];
  globalMasterRoles.value = [];
  globalRoles.value = [];

  roleStore.ROLES.forEach((element) => {
    estimateSheetRoleStore.ESTIMATE_SHEET_ROLES.forEach((item) => {
      if (element.id == item.roleId && props.sheetId == item.estimateSheetId) {
        sheetRoles.value.push(element);
      }
    });
  });

  roleStore.ROLES.forEach((role) => {
    sheetRoles.value.forEach((sheetRole) => {
      if (role.id == sheetRole.id && !sheetRoles.value.includes(role)) {
        sheetRoles.value.push(role);
      }
    });
  });

  roleStore.ROLES.forEach((role) => {
    if (role.global) {
      globalMasterRoles.value.push(role);
    }
  });

  globalMasterRoles.value.forEach((masterRole) => {
    let indexToSplice = 0;

    sheetRoles.value.forEach((sheetRole) => {
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

  newSheetRoleLink.value = {
    estimateSheetId: props.sheetId,
    roleId: 0,
  };
};

const handleCreateLocalRole = async () => {
  let role = await roleStore.createRole(newRole);
  newSheetRoleLink.value.roleId = role.id;
  await estimateSheetRoleStore.createEstimateSheetRole(newSheetRoleLink.value);
  sheetRoles.value.push(role);
};

const handleCreateGlobalRole = async () => {
  newRole.global = true;

  let role = await roleStore.createRole(newRole);

  estimateSheetStore.ESTIMATE_SHEETS.forEach(async (sheet) => {
    newSheetRoleLink.value.estimateSheetId = sheet.id;
    newSheetRoleLink.value.roleId = role.id;
    await estimateSheetRoleStore.createEstimateSheetRole(
      newSheetRoleLink.value
    );
  });
  globalRoles.value.push(role);
  globalMasterRoles.value.push(role);
};

const handleUpdateGlobalRole = async (role, originalRole) => {
  if (role.hourlyWage != originalRole.hourlyWage) {
    newRole.global = false;
    newRole.roleName = role.roleName;
    newRole.hourlyWage = originalRole.hourlyWage;

    let createdRole = await roleStore.createRole(newRole);

    globalRoles.value.push(createdRole);

    estimateSheetStore.ESTIMATE_SHEETS.forEach(async (sheet) => {
      newSheetRoleLink.value.estimateSheetId = sheet.id;
      newSheetRoleLink.value.roleId = createdRole.id;
      await estimateSheetRoleStore.createEstimateSheetRole(
        newSheetRoleLink.value
      );
    });

    globalRoles.value.forEach((globalRole) => {
      const index = globalRoles.value.findIndex(
        (role) => role.roleName == originalRole.roleName
      );

      if (index >= 0 && globalRole.roleName == originalRole.roleName) {
        globalRoles.value.splice(index, 1);
      }
    });

    await roleStore.updateRole(role, originalRole);
  } else {
    let response = await roleStore.updateRole(role);

    globalRoles.value.map((updatedRole) => {
      if (updatedRole.id === typeCheck(role.id))
        Object.assign(updatedRole, response);
    });
  }
};

const handleDeleteLocalRole = (id) => {
  roleStore.deleteRole(id);

  const profileIndex = sheetRoles.value.findIndex((obj) => obj.id === id);

  sheetRoles.value.splice(profileIndex, 1);
};

const handleDeleteGlobalRole = async (role) => {
  newRole.global = false;
  newRole.roleName = role.roleName;
  newRole.hourlyWage = role.hourlyWage;

  let createdRole = await roleStore.createRole(newRole);

  estimateSheetStore.ESTIMATE_SHEETS.forEach(async (sheet) => {
    newSheetRoleLink.value.estimateSheetId = sheet.id;
    newSheetRoleLink.value.roleId = createdRole.id;
    await estimateSheetRoleStore.createEstimateSheetRole(
      newSheetRoleLink.value
    );

    if (sheet.id == props.sheetId) {
      sheetRoles.value.push(newRole);
    }
  });

  await roleStore.deleteRole(role.id);

  const profileIndex = globalMasterRoles.value.findIndex(
    (obj) => obj.id === role.id
  );

  globalMasterRoles.value.splice(profileIndex, 1);
};
// #endregion

// #region SheetStatus
const getSheetStatus = () => {
  globalMasterSheetStatus.value = [];
  sheetStatusStore.SHEET_STATUS.forEach((status) => {
    globalMasterSheetStatus.value.push(status);
  });
};

const handleCreateGlobalSheetStatus = async () => {
  let response = await sheetStatusStore.createSheetStatus(newSheetStatus);
  globalMasterSheetStatus.value.push(response);
};

const handleUpdateGlobalSheetStatus = async (sheetStatus) => {
  let response = await sheetStatusStore.updateSheetStatus(sheetStatus);

  globalMasterSheetStatus.value.map((updatedSheetStatus) => {
    if (updatedSheetStatus.id === typeCheck(sheetStatus.id))
      Object.assign(updatedSheetStatus, response);
  });
};

const handleDeleteGlobalSheetStatus = async (SheetStatus) => {
  await sheetStatusStore.deleteSheetStatus(SheetStatus.id);

  const profileIndex = globalMasterSheetStatus.value.findIndex(
    (obj) => obj.id === SheetStatus.id
  );

  globalMasterSheetStatus.value.splice(profileIndex, 1);
};
// #endregion

// #region EpicStatus
const getEpicStatus = () => {
  globalMasterEpicStatus.value = [];
  epicStatusStore.EPIC_STATUS.forEach((status) => {
    globalMasterEpicStatus.value.push(status);
  });
};

const handleCreateGlobalEpicStatus = async () => {
  let response = await epicStatusStore.createEpicStatus(newEpicStatus);
  globalMasterEpicStatus.value.push(response);
};

const handleUpdateGlobalEpicStatus = async (epicStatus) => {
  let response = await epicStatusStore.updateEpicStatus(epicStatus);

  globalMasterEpicStatus.value.map((updatedEpicStatus) => {
    if (updatedEpicStatus.id === typeCheck(epicStatus.id))
      Object.assign(updatedEpicStatus, response);
  });
};

const handleDeleteGlobalEpicStatus = async (epicStatus) => {
  await epicStatusStore.deleteEpicStatus(epicStatus.id);

  const profileIndex = globalMasterEpicStatus.value.findIndex(
    (obj) => obj.id === epicStatus.id
  );

  globalMasterEpicStatus.value.splice(profileIndex, 1);
};

getProfiles();
getRoles();
getSheetStatus();
getEpicStatus();
</script>

<template>
  <div>
    <Button
      v-if="onSheet"
      text="Lokale Indstillinger"
      @Click="localSettingsTab = true"
    />
    <Button text="Globale Indstillinger" @Click="localSettingsTab = false" />

    <!-- Local settings -->
    <div v-if="localSettingsTab && onSheet">
      <h2>Lokal</h2>

      <h3>Risikoprofiler</h3>
      <div v-for="riskProfile in globals" :key="riskProfile.id">
        <LocalGlobalSettings :data="riskProfile" :renderForm="'riskProfile'" />
      </div>

      <div v-for="riskProfile in sheetProfiles" :key="riskProfile.id">
        <LocalSettings
          :data="riskProfile"
          :renderForm="'riskProfile'"
          @delete="handleDeleteLocalProfile"
        />
      </div>
      <Button text="Ny Profile" @Click="handleCreateLocalProfile" />

      <!-- Local global roles -->
      <h3>Roller</h3>
      <div v-for="role in globalRoles" :key="role.id">
        <LocalGlobalSettings :data="role" :renderForm="'role'" />
      </div>

      <hr />

      <!-- Local roles -->
      <div v-for="role in sheetRoles" :key="role.id">
        <LocalSettings
          :data="role"
          :renderForm="'role'"
          @delete="handleDeleteLocalRole"
        />
      </div>
      <Button text="Ny Role" @Click="handleCreateLocalRole" />
    </div>

    <!-- Global settings -->
    <div v-if="!localSettingsTab">
      <h2>Global</h2>

      <!-- Global riskprofiles -->
      <h3>Risikoprofiler</h3>
      <div v-for="profile in masterGlobals" :key="profile.id">
        <GlobalSettings
          :data="profile"
          :renderForm="'riskProfile'"
          @delete="handleDeleteGlobalProfile"
          @update="handleUpdateGlobalProfile"
        />
      </div>
      <Button text="Ny Profile" @Click="handleCreateGlobalProfile" />

      <!-- Global roles -->
      <h3>Roller</h3>
      <div v-for="role in globalMasterRoles" :key="role.id">
        <GlobalSettings
          :data="role"
          :renderForm="'role'"
          @delete="handleDeleteGlobalRole"
          @update="handleUpdateGlobalRole"
        />
      </div>
      <Button text="Ny Rolle" @Click="handleCreateGlobalRole" />

      <!-- Global sheet status -->
      <h3>Sheet Status</h3>
      <div v-for="status in globalMasterSheetStatus" :key="status.id">
        <GlobalSettings
          :data="status"
          renderForm="sheetStatus"
          @delete="handleDeleteGlobalSheetStatus"
          @update="handleUpdateGlobalSheetStatus"
        />
      </div>
      <Button text="Ny Sheet Status" @Click="handleCreateGlobalSheetStatus" />

      <!-- Global epic status -->
      <h3>Epic Status</h3>
      <div v-for="status in globalMasterEpicStatus" :key="status.id">
        <GlobalSettings
          :data="status"
          renderForm="epicStatus"
          @delete="handleDeleteGlobalEpicStatus"
          @update="handleUpdateGlobalEpicStatus"
        />
      </div>
      <Button text="Ny Epic Status" @Click="handleCreateGlobalEpicStatus" />
    </div>
  </div>
</template>
