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

    <div class="setting">
        <div v-if="disabled" class="setting__open-overlay" @click="(disabled = false)"></div>

        <form v-if="props.renderForm == 'riskProfile'">
            <!-- <p>"icon" Profil Navn</p> -->
            <div class="setting__content">
                <div class="setting__row">
                    <p class="setting__input setting__input--disabled">
                        <Icon icon="icon-globe" class="setting__icon" />
                        {{ props.data.profileName }}
                    </p>
                    <p class="setting__input setting__input--disabled">{{ props.data.percentage }} %</p>
                </div>
                <div v-if="!disabled" class="setting__relation">
                    <div class="setting__row">
                        <p class="setting__input setting__input--disabled">Benyt Global Værdi</p>
                        <input class="setting__input setting__input--checkbox" type="checkbox" @change="useGlobalValue">
                    </div>
                    <div class="setting__row">
                        <p class="setting__input setting__input--disabled">Værdi for ark:</p>
                        <input class="setting__input setting__input--text" type="text" :disabled=writePercentageField v-model="writePercentage">
                    </div>
                </div>
            </div>
            <div v-if="!disabled" class="setting__buttons">
                <Button class="edit-setting" icon="icon-check" @click="handleCreateProfile(props.data)"/>
                <Button class="edit-setting" icon="icon-cross" @click="(disabled = true)"/>
            </div>
        </form>


        <form v-if="props.renderForm == 'role'">
            <!-- <p>"icon" Rolle Navn</p> -->
            <div class="setting__content">
                <div class="setting__row">
                    <p class="setting__input setting__input--disabled">
                        <Icon icon="icon-globe" class="setting__icon" />
                        {{ props.data.roleName }}
                    </p>
                    <p class="setting__input setting__input--disabled">{{ props.data.hourlyWage }} kr/t</p>
                </div>
                <div v-if="!disabled">
                    <div class="setting__row">
                        <p class="setting__input setting__input--disabled">Benyt Global Værdi</p>
                        <input class="setting__input setting__input--checkbox" type="checkbox" @change="useGlobalValue">
                    </div>
                    <div class="setting__row">
                        <p class="setting__input setting__input--disabled">Værdi for ark:</p>
                        <input class="setting__input setting__input--text" type="text" :disabled=writePercentageField v-model="writePercentage">
                    </div>
                </div>
            </div>
            <div v-if="!disabled" class="setting__buttons">
                <Button class="edit-setting" icon="icon-check" @click="handleCreateRole(props.data)"/>
                <Button class="edit-setting" icon="icon-cross" @click="(disabled = true)"/>
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
        background-color: var(--color-task-input);
        border-radius: 4px;
        padding: 6px;
    }

    &__row {
        display: flex;
        justify-content: space-between;
    }

    &__icon {
        width: 20px;
        height: 20px;
        margin-right: 15px;
    }

    &__relation {
        grid-column: span 2;
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

        &--disabled {
            width: auto;
        }

        &--checkbox {
            width: 25px;
            height: 25px;
        }

        &--text {
            width: 50px;
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