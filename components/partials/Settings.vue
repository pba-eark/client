<script setup>

import { useRiskProfileStore } from "~~/store/riskProfiles";
import { useRoleStore } from "~~/store/roles";
import { useSheetStatusStore } from "~~/store/sheetStatus";
import { useEpicStatusStore } from "~~/store/epicStatus";
import { useEstimateSheetRiskProfileStore } from "~~/store/composites/estimateSheetRiskProfiles";

const riskProfileStore = useRiskProfileStore();
const roleStore = useRoleStore();
const sheetStatusStore = useSheetStatusStore();
const epicStatusStore = useEpicStatusStore();
const estimateSheetRiskProfileStore = useEstimateSheetRiskProfileStore();

const props = defineProps({
  sheetId: {
    type: Number,
    required: true
  },
});

const localSettingsTab = ref(true)

const sheetProfiles = ref([]);
const masterGlobals = ref([]);
const globals = ref([]);
const locals = ref([]);

const pushData = ref(false);

onMounted(() => {



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

    sheetProfiles.value.forEach(sheetProfile => {



      let test = globals.value.map((global) => { console.log("global", global), console.log("sheet", sheetProfile) });
      console.log("test", test)

      //if (element.profileName == item.profileName) {
      if (globals.value.filter((global) => { return global.profileName == sheetProfile.profileName; }).length > 0) {

        //globals.value.push(sheetProfile);
      }




      // sheetProfiles.value.filter((sheetProfile) => {
      //   return sheetProfile.profileName !== masterGlobal.profileName;
      // })

      //}

    });

  });

  /*let mgRun = 0
  let spRun = 0

  masterGlobals.value.forEach(element => {

    pushData.value = true;

    mgRun ++
    console.log("mgRun", mgRun)
    console.log("mg push", pushData.value)
    sheetProfiles.value.forEach(item => {

      if (element.profileName == item.profileName && !globals.value.includes(item.profileName) && pushData.value == true) {
        spRun ++
        console.log("spRun", spRun)

        // if (!globals.value.includes(item) && pushData == true) {

        //   globals.value.push(item);
        //   pushData = false;

        // }
        console.log("add to global", item)
        globals.value.push(item);
        pushData.value = false;
        console.log("sp push", pushData.value)
      }
      else if (!locals.value.includes(item) && !globals.value.includes(element)) {

        spRun ++
        console.log("spRun", spRun)
        // if (!globals.value.includes(element)) {
        //   globals.value.push(element);
        // }

        // if (!locals.value.includes(item) && !globals.value.includes(item)) {
        //   locals.value.push(item);
        // }
        console.log("add to local", item)
        locals.value.push(item);
        console.log("sp push", pushData.value)
      }
    });
  });*/


  console.log("sheetProfiles", sheetProfiles.value)
  //console.log("masterGlobals", masterGlobals.value)
  console.log("globals", globals.value)
  //console.log("locals", locals.value)
});




</script>

<template>
  <div>

    <Button text="Lokale Indstillinger" @Click="localSettingsTab = true" />
    <Button text="Globale Indstillinger" @Click="localSettingsTab = false" />

    <div v-if="localSettingsTab">
      <h2>Lokal</h2>

      <h3>Risikoprofiler</h3>
      <div v-for="riskProfile in globals.value" :key="riskProfile.id">
        <LocalGlobalSettings :data="riskProfile" />
      </div>
      <p>-----------------------------</p>
      <div v-for="riskProfile in locals.value" :key="riskProfile.id">
        <LocalSettings :data="riskProfile" />
      </div>


      <h3>Roller</h3>
      <!-- <div v-for="role in roleStore.ROLES" :key="role.id">
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
        <div v-if="!epicStatus.global">
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






    <div v-if="!localSettingsTab">
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