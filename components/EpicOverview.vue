<script setup>
import { useRoleStore } from "~/store/roles";

const roleStore = useRoleStore();
const roleDetails = ref([]);
const isOpen = ref(false);
const props = defineProps({
  id: Number,
  name: String,
  totalRealisticHours: Number,
  totalRealisticPrice: Number,
  totalPessimisticHours: Number,
  totalPessimisticPrice: Number,
  optOuts: Number,
  status: Object,
  riskProfile: Object,
  taskRoles: Array,
});

const numberDotSeperator = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
/* TODO: Læg alle de enkelte rollers tasks sammen (med præberegnede værdier) */

// const totalRealisticHrsForRole = (role) => {
//   const { tasks } = role;
//   let total = 0;
//   tasks.forEach(({ realisticHours }) => (total += realisticHours));
//   return total;
// };
</script>

<template>
  <div v-bind="$attrs">
    <div class="row" :class="{ row__open: isOpen }" @click="isOpen = !isOpen">
      <div><Icon icon="icon-chevron" class="row__icon" /> {{ isOpen }}</div>
      <div>{{ name }}</div>
      <div>{{ totalRealisticHours.toFixed(2).replace(".", ",") }}</div>
      <div>
        {{
          numberDotSeperator(totalRealisticPrice.toFixed(2).replace(".", ","))
        }}
      </div>
      <div>{{ totalPessimisticHours.toFixed(2).replace(".", ",") }}</div>
      <div>
        {{
          numberDotSeperator(totalPessimisticPrice.toFixed(2).replace(".", ","))
        }}
      </div>
      <div>{{ optOuts }}</div>
      <div>{{ status.epicStatusName }}</div>
      <div></div>
      <div></div>
    </div>

    <div v-for="role in taskRoles" class="row__details" v-show="isOpen">
      <div>{{ role.roleName }}</div>
      <div>{{ `${role.hourlyWage} kr/t` }}</div>
      <!-- <div>{{ totalRealisticHrsForRole(role) }}</div> -->
      <!-- <div>total realstisk: {{ totalRealisticHrsForRole }}</div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.row {
  background: #fff;
  align-items: center;
  padding: 16px 8px;
  cursor: pointer;
  display: grid;
  grid-template-columns: 50px 200px 150px 150px 150px 150px 125px 150px auto auto;
  user-select: none;

  &__icon {
    height: 15px;
    width: 15px;
    margin: 0 auto;
    display: block;
  }

  &__details {
    background: #444;
    color: #fff;
    width: 100%;
    display: grid;
    grid-template-columns: 100px 100px 100px;
  }
}
</style>
