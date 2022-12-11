<script setup>

import { useRiskProfileStore } from '~~/store/riskProfiles';
import { useRoleStore } from '~~/store/roles';

const riskProfileStore = useRiskProfileStore();
const roleStore = useRoleStore();

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

const data = props.data;

let disabled = ref(true);

/* Profile */
const handleUpdateProfile = (obj) => {
    riskProfileStore.updateRiskProfile(obj);
};

/* Role */
const handleUpdateRole = (obj) => {
    roleStore.updateRole(obj);
};

</script>

<template>
    <div>
        <div>

            <br>

            <form v-if="props.renderForm == 'riskProfile'">
                <p for="name">"icon" Profil Navn</p>
                <input type="text" :disabled=disabled v-model="data.profileName">
                <input type="text" :disabled=disabled v-model="data.percentage">
                <Button text="Delete" @click="$emit('delete', data.id)" />
                <Button v-if="disabled" text="Edit" @click="(disabled = false)" />
                <div v-if="!disabled">
                    <Button text="Save" @click="handleUpdateProfile(data)"/>
                    <Button text="Unsave" @click="(disabled = true)"/>
                </div>
            </form>

            <br>
            <form v-if="props.renderForm == 'role'">
                <p for="name">"icon" Rolle Navn</p>
                <input type="text" :disabled=disabled v-model="data.roleName">
                <input type="text" :disabled=disabled v-model="data.hourlyWage">
                <Button v-if="disabled" text="Edit" @click="(disabled = false)" />
                <div v-if="!disabled">
                    <Button text="Save" @click="handleUpdateRole(data)"/>
                    <Button text="Unsave" @click="(disabled = true)"/>
                </div>
            </form>

            <br>
            <form v-if="props.renderForm == 'sheetStatus'">
                <p>Status Navn</p>
                <p>{{ props.data.sheetStatusName }}</p>
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