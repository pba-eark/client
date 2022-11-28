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
  </ul>
</template>

<style lang="scss" scoped>
.tabs {
  background: pink;
  display: flex;
  list-style: none;

  &__tab {
    margin-right: 5px;

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
