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

let originalData = {...props.data};

let disabled = ref(true); 

</script>

<template>

    <div>
        <form v-if="props.renderForm == 'riskProfile'">
            <p for="name">"icon" Profil Navn</p>
            <input type="text" :disabled=disabled v-model="props.data.profileName">
            <input type="text" :disabled=disabled v-model="props.data.percentage">
            <Button v-if="disabled" text="Edit" @click="(disabled = false)" />
            <div v-if="!disabled">
                <Button text="Save" @click="(($emit('update', props.data, originalData)), disabled = true)" />
                <Button text="Unsave" @click="(disabled = true)" />
                <Button text="Delete" @click="($emit('delete', props.data))"/>
            </div>
        </form>

        <br>

        <form v-if="props.renderForm == 'role'">
            <p for="name">"icon" Role Navn</p>
            <input type="text" :disabled=disabled v-model="props.data.roleName">
            <input type="text" :disabled=disabled v-model="props.data.hourlyWage">
            <Button v-if="disabled" text="Edit" @click="(disabled = false)" />
            <div v-if="!disabled">
                <Button text="Save" @click="(($emit('update', props.data, originalData)), disabled = true)" />
                <Button text="Unsave" @click="(disabled = true)" />
                <Button text="Delete" @click="($emit('delete', props.data))"/>
            </div>
        </form>

        <br>

        <form v-if="props.renderForm == 'sheetStatus'">
            <p for="name">"icon" Status Navn</p>
            <input type="text" :disabled=disabled v-model="props.data.sheetStatusName">
            <Button v-if="disabled" text="Edit" @click="(disabled = false)" />
            <div v-if="!disabled">
                <Button text="Save" @click="(($emit('update', props.data)), disabled = true)" />
                <Button text="Unsave" @click="(disabled = true)" />
                <Button text="Delete" @click="($emit('delete', props.data))"/>
            </div>
        </form>

        <br>

        <form v-if="props.renderForm == 'epicStatus'">
            <p for="name">"icon" Status Navn</p>
            <input type="text" :disabled=disabled v-model="props.data.epicStatusName">
            <Button v-if="disabled" text="Edit" @click="(disabled = false)" />
            <div v-if="!disabled">
                <Button text="Save" @click="(($emit('update', props.data)), disabled = true)" />
                <Button text="Unsave" @click="(disabled = true)" />
                <Button text="Delete" @click="($emit('delete', props.data))"/>
            </div>
        </form>
    </div>

</template>