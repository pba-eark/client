<script setup>
import { useCustomerStore } from "~/store/customers";
import { useEstimateSheetStore } from "~~/store/estimateSheets";
import { useAuthStore } from "~/store/auth";
import { useTabsStore } from "~/store/tabs";

const customerStore = useCustomerStore();
const sheetStore = useEstimateSheetStore();
const authStore = useAuthStore();
const tabStore = useTabsStore();

const customers = ref([]);
const isProjectsOpen = ref(false);
const showMissingCustomerSheets = ref(false);

onMounted(async () => {
  await customerStore.getCustomers(authStore.API_TOKEN);
  await sheetStore.getEstimateSheets(authStore.API_TOKEN);

  /* Værsgo gæd */
  console.log(window.innerHeight);
  document.documentElement.style.setProperty(
    "--test",
    `${window.innerHeight}px`
  );
});

watch(
  () => sheetStore.ESTIMATE_SHEETS,
  async () => {
    customers.value = [];
    customerStore.CUSTOMERS.map((c) => {
      c.visible = false;
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
      const userSheets = sheetStore.ESTIMATE_SHEETS.filter((s) => {
        if (s.customerId === c.id) return s;
      });

      customers.value.push({ ...c, sheets: userSheets });
    });
  }
);

const sheetsWithoutCustomers = computed(() => {
  return sheetStore.ESTIMATE_SHEETS.filter((sheet) => {
    return !sheet.customerId;
  });
});
</script>

<template>
  <div class="block">
    <div class="block__header">
      <Button text="Globale indstillinger" icon="icon-cog" />

      <div class="block__projects">
        <Button
          text="Projekter"
          icon="icon-folder"
          @click="isProjectsOpen = !isProjectsOpen"
          class="projects"
        />

        <transition name="fade">
          <ul v-show="isProjectsOpen">
            <!-- Customer list -->
            <li v-for="customer in customers">
              <p @click="customer.visible = !customer.visible">
                <span>
                  <Icon
                    icon="icon-chevron"
                    :class="{ rotate: !customer.visible }"
                  />
                </span>
                <span>{{ customer.customerName }} ({{ customer.id }})</span>
              </p>

              <!-- Projects for customer -->
              <ul v-show="customer.visible">
                <li v-for="sheet in customer.sheets">
                  <NuxtLink
                    :to="`/sheet/${sheet.id}`"
                    @click="tabStore.handleOpenTab(sheet)"
                  >
                    {{ sheet.sheetName }}
                  </NuxtLink>
                </li>
              </ul>
            </li>

            <li v-if="sheetsWithoutCustomers && sheetsWithoutCustomers.length">
              <p
                @click="showMissingCustomerSheets = !showMissingCustomerSheets"
              >
                <span>
                  <Icon
                    icon="icon-chevron"
                    :class="{ rotate: !showMissingCustomerSheets }"
                  />
                </span>
                <span>Mangler kunde</span>
              </p>

              <ul v-show="showMissingCustomerSheets">
                <li v-for="sheet in sheetsWithoutCustomers">
                  <NuxtLink
                    :to="`/sheet/${sheet.id}`"
                    @click="tabStore.handleOpenTab(sheet)"
                  >
                    {{ sheet.sheetName }}
                  </NuxtLink>
                </li>
              </ul>
            </li>
          </ul>
        </transition>
      </div>

      <Button
        icon="icon-plus"
        text="Nyt estimatark"
        @click="$router.push('/sheet/create')"
      />
    </div>

    <div class="block__epics"></div>
  </div>
</template>

<style lang="scss" scoped>
.block {
  height: calc(100vh - var(--header-height));
  // overflow-y: scroll;
  background: #2e3032;
  padding: 15px;

  &__header {
    border-bottom: 2px solid #242424;
    padding: 15px 0;

    button {
      width: 100%;
      margin-bottom: 15px;
      height: 36px;
      padding: 0 5px;
      border: none;

      &.projects {
        background: #606060;
        color: #fff;
        margin: 0;
      }

      a {
        color: inherit;
        text-decoration: none;
      }
    }
  }

  &__projects {
    height: 100%;
    overflow: hidden;
    margin-bottom: 15px;
    color: #fff;

    > ul {
      border-top: 1px solid #242424;
      background: #606060;
      padding: 5px 8px;

      p {
        padding: 5px 0;
        cursor: pointer;
        user-select: none;
        font-weight: bold;

        svg {
          height: 10px;
          width: 10px;
          margin-right: 8px;
        }
      }

      ul {
        margin-left: 5px;
        border-left: 1px solid #fff;
        padding-left: 6px;
        margin-bottom: 5px;

        li {
          padding: 3px 0;
        }
      }
    }
  }
}

.rotate {
  transform: rotate(270deg);
}
</style>
