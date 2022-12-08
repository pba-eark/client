<script setup>

import { useRiskProfileStore } from '~~/store/riskProfiles';

const riskProfileStore = useRiskProfileStore();

const input = ref(null)

const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    renderForm: {
        type: String,
        required: true
    }
});

/* Profile */
const handleCreateProfile = (obj) => {
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

let disabled = ref(true)
let writePercentageField = ref(false)

const riskProfile = props.data;
let writePercentage = null;

const useGlobalValue = () => {
    writePercentageField.value = !writePercentageField.value;
    writePercentage = null;
};



</script>

<template>
    <div>
        <div>

            <br>

            <form v-if="props.renderForm == 'riskProfile'">
                <p>"icon" Profil Navn</p>
                <p>{{ props.data.profileName }}</p>
                <p>{{ props.data.percentage }}</p>
                <Button v-if="disabled" text="Edit" @click="(disabled = false)" />
                <div v-if="!disabled">
                    <p>Benyt Global Værdi</p>
                    <p>{{ props.data.percentage }}%</p>
                    <input type="checkbox" @change="useGlobalValue">
                    <input type="text" :disabled=writePercentageField v-model="writePercentage">
                    <Button text="Save" @click="handleCreateProfile(props.data)"/>
                    <Button text="Unsave" @click="(disabled = true)"/>
                </div>
            </form>

            <br>

            <form v-if="props.renderForm == 'role'">
                <p>"icon" Rolle Navn</p>
                <p>{{ props.data.roleName }}</p>
                <p>{{ props.data.hourlyWage }}</p>
                <Button v-if="disabled" text="Edit" @click="(disabled = false)" />
                <div v-if="!disabled">
                    <p>Benyt Global Værdi</p>
                    <p>{{ props.data.hourlyWage }}kr</p>
                    <input type="checkbox" @change="useGlobalValue">
                    <input type="text" :disabled=writePercentageField v-model="writePercentage">
                    <Button text="Save" @click="handleCreateRole(props.data)"/>
                    <Button text="Unsave" @click="(disabled = true)"/>
                </div>
            </form>


            <!-- <Input @change="handleUpdateProfile(props.data, 'name')" v-model="input"
                :default="props.data.profileName" />
            <Input @change="handleUpdateProfile(props.data, 'percentage')" v-model="input"
                :default="props.data.percentage || '0'" />
            <Input type="checkbox" @change="handleUpdateProfile(props.data, 'global')" v-model="input"
                :default="props.data.global" />
            <Input type="checkbox" @change="handleUpdateProfile(props.data, 'default')" v-model="input"
                :default="props.data.default" />
            <Button text="Save Profil" @Click="handleUpdateProfile(props.data)" /> -->
        </div>
        <!-- <br>
        <Button text="Ny Profil" @Click="handleCreateProfile(newRiskProfile, 'globalSetting')" />
        <br>

        <div>
            <Input @change="handleUpdateRole(role, 'name')" v-model="input" :default="role.roleName" />
            <Input @change="handleUpdateRole(role, 'wage')" v-model="input" :default="role.hourlyWage || '0'" />
            <Input type="checkbox" @change="handleUpdateRole(role, 'global')" v-model="input" :default="role.global" />
            <Input type="checkbox" @change="handleUpdateRole(role, 'default')" v-model="input"
                :default="role.default" />
            <Button text="Edit Rolle" @Click="handleUpdateRole(props.data, 'name')" />
        </div> -->
    </div>
</template>