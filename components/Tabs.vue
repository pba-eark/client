<script setup>
import { useTabsStore } from "~/store/tabs";

const tabStore = useTabsStore();
</script>

<template>
  <ul class="tabs">
    <li v-for="tab in tabStore.TABS" class="tabs__tab tab">
      <NuxtLink :to="`/sheet/${tab.id}`">
        <span class="name">{{ tab.sheetName }}</span>

        <Icon
          icon="icon-cross"
          class="close"
          @click.prevent="tabStore.closeTab(tab)"
        />
      </NuxtLink>
    </li>

    <!-- Temporary tab -->
    <li v-if="tabStore.TEMP_TAB !== null" class="tabs__tab tab temp">
      <NuxtLink :to="`/sheet/${tabStore.TEMP_TAB.id}`">
        <span class="name">{{ tabStore.TEMP_TAB.sheetName }}</span>

        <Icon
          icon="icon-cross"
          class="close"
          @click.prevent="tabStore.closeTempTab"
        />
      </NuxtLink>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.tabs {
  background: pink;
  display: flex;
  list-style: none;

  &__tab {
    margin-right: 5px;

    &.temp {
      font-style: italic;
      &.router-link-exact-active {
        background: blue;
      }
    }

    a {
      height: 100%;
      display: flex;
      align-items: center;
      background: #666;
      color: #fff;
      text-decoration: none;
      padding: 0 8px;

      &.router-link-exact-active {
        background: blue;
      }
    }

    .close {
      height: 15px;
      width: 15px;
      margin-left: 8px;
    }
  }
}
</style>
