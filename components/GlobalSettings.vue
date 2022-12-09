<script setup>

import { useRiskProfileStore } from '~~/store/riskProfiles';

const riskProfileStore = useRiskProfileStore();

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

let disabled = ref(true);

/* Profile */
const handleUpdateProfile = (obj) => {
    riskProfileStore.updateRiskProfile(obj);
};

console.log(props.data, props.renderForm)

</script>

<template>

    <div>
        <form v-if="props.renderForm == 'riskProfile'">
            <p for="name">"icon" Profil Navn</p>
            <input type="text" :disabled=disabled v-model="props.data.profileName">
            <input type="text" :disabled=disabled v-model="props.data.percentage">
            <Button v-if="disabled" text="Edit" @click="(disabled = false)" />
            <div v-if="!disabled">
                <Button text="Save" @click="handleUpdateProfile(props.data)" />
                <Button text="Unsave" @click="(disabled = true)" />
            </div>
        </form>

        <br>

        <form v-if="props.renderForm == 'role'">
            <p for="name">"icon" Role Navn</p>
            <input type="text" :disabled=disabled v-model="props.data.roleName">
            <input type="text" :disabled=disabled v-model="props.data.hourlyWage">
            <Button v-if="disabled" text="Edit" @click="(disabled = false)" />
            <div v-if="!disabled">
                <Button text="Save" @click="handleUpdateProfile(props.data)" />
                <Button text="Unsave" @click="(disabled = true)" />
            </div>
        </form>

        <br>

        <form v-if="props.renderForm == 'sheetStatus'">
            <p for="name">"icon" Role Navn</p>
            <input type="text" :disabled=disabled v-model="props.data.sheetStatusName">
            <Button v-if="disabled" text="Edit" @click="(disabled = false)" />
            <div v-if="!disabled">
                <Button text="Save" @click="handleUpdateProfile(props.data)" />
                <Button text="Unsave" @click="(disabled = true)" />
            </div>
        </form>
    </div>

</template>