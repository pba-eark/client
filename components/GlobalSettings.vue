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

    <div class="setting">
        <div v-if="disabled" class="setting__open-overlay" @click="(disabled = false)"></div>

        <form v-if="props.renderForm == 'riskProfile'">
            <!-- <p for="name">"icon" Profil Navn</p> -->
            <div class="setting__content">
                <input class="setting__input" type="text" :disabled=disabled v-model="props.data.profileName">
                <input class="setting__input setting__input--right" type="text" :disabled=disabled v-model="props.data.percentage">
            </div>
            <!-- <Button v-if="disabled" text="Edit" @click="(disabled = false)" /> -->
            <div v-if="!disabled" class="setting__buttons">
                <Button class="edit-setting" icon="icon-check" @click="(($emit('update', props.data, originalData)), disabled = true)" />
                <Button class="edit-setting" icon="icon-cross" @click="(disabled = true)" />
                <Button class="edit-setting" icon="icon-trash" @click="($emit('delete', props.data))"/>
            </div>
        </form>

        <form v-if="props.renderForm == 'role'">
            <!-- <p for="name">"icon" Role Navn</p> -->
            <div class="setting__content">
                <input class="setting__input" type="text" :disabled=disabled v-model="props.data.roleName">
                <input class="setting__input setting__input--right" type="text" :disabled=disabled v-model="props.data.hourlyWage">
            </div>
            <!-- <Button v-if="disabled" text="Edit" @click="(disabled = false)" /> -->
            <div v-if="!disabled">
                <Button text="Save" @click="(($emit('update', props.data, originalData)), disabled = true)" />
                <Button text="Unsave" @click="(disabled = true)" />
                <Button text="Delete" @click="($emit('delete', props.data))"/>
            </div>
        </form>

        <form v-if="props.renderForm == 'sheetStatus'">
            <!-- <p for="name">"icon" Status Navn</p> -->
            <div class="setting__content">
                <input class="setting__input" type="text" :disabled=disabled v-model="props.data.sheetStatusName">
            </div>
            <!-- <Button v-if="disabled" text="Edit" @click="(disabled = false)" /> -->
            <div v-if="!disabled">
                <Button text="Save" @click="(($emit('update', props.data)), disabled = true)" />
                <Button text="Unsave" @click="(disabled = true)" />
                <Button text="Delete" @click="($emit('delete', props.data))"/>
            </div>
        </form>

        <form v-if="props.renderForm == 'epicStatus'">
            <!-- <p for="name">"icon" Status Navn</p> -->
            <div class="setting__content">
                <input class="setting__input" type="text" :disabled=disabled v-model="props.data.epicStatusName">
            </div>
            <!-- <Button v-if="disabled" text="Edit" @click="(disabled = false)" /> -->
            <div v-if="!disabled">
                <Button text="Save" @click="(($emit('update', props.data)), disabled = true)" />
                <Button text="Unsave" @click="(disabled = true)" />
                <Button text="Delete" @click="($emit('delete', props.data))"/>
            </div>
        </form>
    </div>

</template>

<style lang="scss" scoped>

.setting {
    position: relative;
    margin-bottom: 100px;

    &__open-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    &__content {
        width: 100%;
        display: grid;
        grid-template-columns: 3fr 1fr;
        gap: 6px;
        background-color: var(--color-task-input);
        border-radius: 4px;
        padding: 6px;
    }

    &__input {
        width: 100%;
        font-size: 1rem;
        line-height: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        border-radius: 3px;
        font-size: inherit;
        line-height: inherit;
        color: inherit;
        font-style: inherit;
        padding: var(--input-padding);

        &:focus-visible {
          outline: none;
        }

        &--right {
            text-align: right;
        }
    }

    &__buttons {
        display: grid;
        grid-template-columns: auto auto 1fr;
        justify-items: end;
        gap: 4px;
        margin-bottom: 20px;
    }
}


</style>