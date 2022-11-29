<script setup>

import { useAuthStore } from "~/store/auth";
import { useRoleStore } from "~/store/roles";
import { useRiskProfileStore } from "~/store/riskprofiles";

const authStore = useAuthStore();
const roleStore = useRoleStore();
const riskProfileStore = useRiskProfileStore();

</script>

<template>
    <p>Task Her</p>
</template>