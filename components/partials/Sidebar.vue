<script setup>
import { useCustomerStore } from "~/store/customers";
import { useEstimateSheetStore } from "~~/store/estimateSheets";
import { useAuthStore } from "~/store/auth";

const customerStore = useCustomerStore();
const sheetStore = useEstimateSheetStore();
const authStore = useAuthStore();

const customers = ref([]);

onMounted(async () => {
  await customerStore.getCustomers(authStore.API_TOKEN);
  await sheetStore.getEstimateSheets(authStore.API_TOKEN);
});

watch(
  () => sheetStore.GET_ESTIMATE_SHEETS,
  async () => {
    customers.value = [];
    customerStore.CUSTOMERS.map((c) => {
      const userSheets = sheetStore.ESTIMATE_SHEETS.filter((s) => {
        if (s.customerId === c.id) return s;
      });

      customers.value.push({ ...c, sheets: userSheets });
    });
  }
);

watch(
  () => customerStore.CUSTOMERS,
  async () => {
    customers.value = [];
    customerStore.CUSTOMERS.map((c) => {
      const userSheets = sheetStore.GET_ESTIMATE_SHEETS.filter((s) => {
        if (s.customerId === c.id) return s;
      });

      customers.value.push({ ...c, sheets: userSheets });
    });
  }
);

const sheetsWithoutCustomers = computed(() => {
  return sheetStore.GET_ESTIMATE_SHEETS.filter((sheet) => {
    return !sheet.customerId;
  });
});
</script>

<template>
  <div class="block">
    <div class="block__header">
      <NuxtLink to="/sheet/create">Nyt estimatark</NuxtLink>
    </div>

    <div class="block__projects">
      <ul>
        <!-- Customer list -->
        <li v-for="customer in customers">
          {{ customer.customerName }} ({{ customer.id }})

          <!-- Projects for customer -->
          <ul>
            <li v-for="sheet in customer.sheets">* {{ sheet.sheetName }}</li>
          </ul>
        </li>

        <li v-if="sheetsWithoutCustomers && sheetsWithoutCustomers.length">
          Mangler kunde
          <ul>
            <li v-for="sheet in sheetsWithoutCustomers">
              *{{ sheet.sheetName }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.block {
  height: calc(100vh - var(--header-height));
  overflow-y: scroll;

  &__header {
    height: 200px;
    background: red;
  }

  &__projects {
    height: 100%;
    background: purple;
    color: #fff;
  }
}
</style>
