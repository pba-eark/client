<script setup>
import { useTabsStore } from "~/store/tabs";
import { useCustomerStore } from "~/store/customers";
const tabStore = useTabsStore();
const customerStore = useCustomerStore();

const tabsElement = ref(null);
const horizontalScroll = ref(true);

onBeforeMount(() => {
  window.addEventListener("mouseover", handleMouseover);
  window.addEventListener("wheel", handleScroll, { passive: false });
});

onBeforeUnmount(() => {
  window.removeEventListener("mouseover", handleMouseover);
  window.removeEventListener("wheel", handleScroll);
});

const handleMouseover = (e) => {
  if (e.target === tabsElement.value || tabsElement.value.contains(e.target)) {
    horizontalScroll.value = false;
  } else {
    horizontalScroll.value = true;
  }
};

const handleScroll = (e) => {
  if (horizontalScroll.value) return;
  e.preventDefault();
  tabsElement.value.scrollLeft += e.deltaY - 2 * e.deltaY;
};

const reverseTabs = computed(() => {
  return tabStore.TABS.reverse();
});

const getCustomerName = ({ customerId }) => {
  if (!customerId) return false;
  for (let i = 0; i < customerStore.CUSTOMERS.length; i++) {
    if (customerStore.CUSTOMERS[i].id == customerId)
      return customerStore.CUSTOMERS[i].customerName;
  }
};
</script>

<template>
  <ul class="tabs">
    <li class="tabs__tab tab static">
      <NuxtLink :to="`/`">
        <Icon icon="icon-home" />
      </NuxtLink>
    </li>

    <li class="tabs__tab tab static">
      <NuxtLink :to="`/sheet/create`">
        <Icon icon="icon-plus" />
      </NuxtLink>
    </li>

    <div class="tabs__scroll" ref="tabsElement">
      <!-- Temporary tab -->
      <li v-if="tabStore.TEMP_TAB !== null" class="tabs__tab tab temp">
        <NuxtLink :to="`/sheet/${tabStore.TEMP_TAB.id}`">
          <div>
            <span class="name">{{ tabStore.TEMP_TAB.sheetName }}</span>
            <br /><small class="small">
              {{ getCustomerName(tabStore.TEMP_TAB) || "Mangler kunde" }}
            </small>
          </div>

          <Icon
            icon="icon-cross"
            class="close"
            @click.prevent="tabStore.closeTempTab"
          />
        </NuxtLink>
      </li>

      <!-- Tabs -->
      <li v-for="tab in reverseTabs" class="tabs__tab tab">
        <NuxtLink :to="`/sheet/${tab.id}`">
          <div>
            <span class="name">{{ tab.sheetName }}</span>
            <br /><small class="small">{{
              getCustomerName(tab) || "Mangler kunde"
            }}</small>
          </div>
          <Icon
            icon="icon-cross"
            class="close"
            @click.prevent="tabStore.closeTab(tab)"
          />
        </NuxtLink>
      </li>
    </div>
  </ul>
</template>

<style lang="scss" scoped>
.tabs {
  display: flex;
  list-style: none;
  overflow: hidden;

  &__scroll {
    width: 100%;
    display: flex;
    // overflow-x: overlay;
    // overflow-y: hidden;
    rotate: 180deg;
    direction: rtl;
    overflow: hidden;

    &:hover {
      overflow-x: overlay;
      overflow-y: hidden;
    }
    > * {
      rotate: -180deg;
    }
    /* width */
    &::-webkit-scrollbar {
      height: 5px;
    }
    /* Track */
    &::-webkit-scrollbar-track {
      // box-shadow: inset 0 0 5px grey;
      border-radius: 10px;
    }
    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: rgb(198, 253, 0);
      border-radius: 10px;
    }
    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: #b30000;
      // display: initial;
    }
  }

  &__tab {
    min-width: max-content;
    direction: ltr;
    text-align: left;

    a {
      margin-right: 1px;
      height: 100%;
      display: flex;
      align-items: center;
      background: var(--color-tabs);
      color: var(--font-color-secondary);
      text-decoration: none;
      padding: 0px 15px;
      font-weight: 600;

      .small {
        opacity: 0.75;
        font-weight: 400;
      }
      .close {
        color: var(--font-color-secondary);
      }

      &.router-link-exact-active {
        background: var(--color-background);
        color: var(--color-tabs);
        .close {
          color: var(--color-tabs);
        }
      }
    }

    &.temp {
      font-style: italic;
      &.router-link-exact-active {
        background: var(--color-background);
        color: var(--color-tabs);
        .close {
          color: var(--color-tabs);
        }
      }
    }

    &.static {
      svg {
        height: 30px;
        width: 30px;
      }
    }

    .close {
      height: 10px;
      width: 10px;
      margin-left: 20px;
    }
  }
}
</style>
