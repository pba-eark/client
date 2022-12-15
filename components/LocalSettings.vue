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
                <Button text="Delete" @click="($emit('delete', data.id))" />
                <Button v-if="disabled" text="Edit" @click="(disabled = false)" />
                <div v-if="!disabled">
                    <Button text="Save" @click="handleUpdateProfile(data), (disabled = true)"/>
                    <Button text="Unsave" @click="(disabled = true)"/>
                </div>
            </form>

            <br>
            <form v-if="props.renderForm == 'role'">
                <p for="name">"icon" Rolle Navn</p>
                <input type="text" :disabled=disabled v-model="data.roleName">
                <input type="text" :disabled=disabled v-model="data.hourlyWage">
                <Button text="Delete" @click="$emit('delete', data.id)" />
                <Button v-if="disabled" text="Edit" @click="(disabled = false)" />
                <div v-if="!disabled">
                    <Button text="Save" @click="handleUpdateRole(data), (disabled = true)"/>
                    <Button text="Unsave" @click="(disabled = true)"/>
                </div>
            </form>

            <br>
            <form v-if="props.renderForm == 'sheetStatus'">
                <p>Status Navn</p>
                <p>{{ props.data.sheetStatusName }}</p>
            </form>
        </div>
    </div>
</template>