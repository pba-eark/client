<script setup>

import { useRiskProfileStore } from '~~/store/riskProfiles';

const riskProfileStore = useRiskProfileStore();

const props = defineProps({
    data: {
        type: Object,
        required: true
    },
});

const riskProfile = props.data;

let disabled = ref(true);

</script>

<template>
    <div>
        <div>

            <br>

            <form>
                <p for="name">"icon" Profil Navn</p>
                <input type="text" :disabled=disabled v-model="riskProfile.profileName">
                <input type="text" :disabled=disabled v-model="riskProfile.percentage">
                <Button v-if="disabled" text="Edit" @click="(disabled = false)" />
                <div v-if="!disabled">
                    <Button text="Save" @click="handleUpdateProfile(riskProfile)"/>
                    <Button text="Unsave" @click="(disabled = true)"/>
                </div>
            </form>

            <br>


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