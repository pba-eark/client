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

let originalData = ref(props.data);

let disabled = ref(true);

/* Profile */
const handleUpdateProfile = (obj) => {
// create ny profile som ikke er global 
  // for hver sheet i storen
  // opdater composite tabel med ny profil 
  // Gør så alle sheets har en lokalglobal profil
  // Sheets har her både den globale og den lokalglobale profil
  // opdater den originale profile med ny info, eller slet den og stop
  // hvis profilerne har samme navn, men ikke samme procentsats, burde der være en lokalglobal med en anden procentværdig end den under globale settings
  // hvis profilerne har same procentsats, men ikke samme navn, burde der være en lokal profil men den globalelokale er væk, da task felterne der brugte den nu bruger den nye lokale profil

    riskProfileStore.updateRiskProfile(obj);

    array.forEach(element => {
        
    });
};

 

</script>

<template>

    <div>
        <form v-if="props.renderForm == 'riskProfile'">
            <p for="name">"icon" Profil Navn</p>
            <input type="text" :disabled=disabled v-model="props.data.profileName">
            <input type="text" :disabled=disabled v-model="props.data.percentage">
            <Button v-if="disabled" text="Edit" @click="(disabled = false)" />
            <div v-if="!disabled">
                <Button text="Save" @click="($emit('update', props.data, originalData))" />
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