<script setup>

import { useRiskProfileStore } from "~~/store/riskProfiles";
import { useRoleStore } from "~~/store/roles";
import { useSheetStatusStore } from "~~/store/sheetStatus";
import { useEpicStatusStore } from "~~/store/epicStatus";

const riskProfileStore = useRiskProfileStore();
const roleStore = useRoleStore();
const sheetStatusStore = useSheetStatusStore();
const epicStatusStore = useEpicStatusStore();

const handleUpdateProfileName = (val) => {
  return console.log(val)
  props.data.roleId = id;
  riskProfileStore.updateTask(props.data);
  detailsStore.setDetails(props.data);
};

</script>

<template>
  <div>

    <div>
      <h2>Global</h2>
      <h3>Risikoprofiler</h3>
      <div v-for="riskProfile in riskProfileStore.RISK_PROFILES" :key="riskProfile.id">
        <div v-if="riskProfile.global">
          <Input emit="updateProfileName" @updateProfileName="handleUpdateProfileName" :default="riskProfile.profileName" />
          <Input :default="riskProfile.percentage" />
          <Input type="checkbox" :default="riskProfile.default" />
        </div>
        <br>

        <h3>Roller</h3>
        <div v-for="role in roleStore.ROLES" :key="role.id">
          <Input :default="role.roleName" />
          <Input :default="role.hourlyWage" />
        </div>
        <br>

        <h3>Ark status</h3>
        <div v-for="sheetStatus in sheetStatusStore.SHEET_STATUS" :key="sheetStatus.id">
          <Input :default="sheetStatus.sheetStatusName" />
        </div>

        <h3>Epic status</h3>
        <div v-for="epicStatus in epicStatusStore.EPIC_STATUS" :key="epicStatus.id">
          <Input :default="epicStatus.epicStatusName" />
        </div>
      </div>
      <br>

      <h2>Lokal</h2>
      <h3>Risikoprofiler</h3>
      <div v-for="riskProfile in riskProfileStore.RISK_PROFILES" :key="riskProfile.id">
        <div v-if="!riskProfile.global">
          <Input :default="riskProfile.profileName" />
          <Input :default="riskProfile.percentage" />
          <Input type="checkbox" :default="riskProfile.default" />
          <Input type="checkbox" :default="riskProfile.global" />
        </div>
      </div>
      <br>

      <h3></h3>

    </div>

    <Button text="Ny Profil" @Click="handleCreateRiskProfile" />





  </div>
</template>