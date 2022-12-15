<template>
  <div class="layout">
    <Tabs class="tab-section" />
    <Sidebar class="sidebar-left" />
    <main>
      <slot />
    </main>
    <Details class="sidebar-right" />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  background-color: var(--color-background);
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: grid;
  gap: 0 1px;
  grid-template-columns: 200px auto 350px;
  grid-template-rows: 60px auto;
  grid-template-areas:
    "sidebarLeft tab-section sidebarRight"
    "sidebarLeft main sidebarRight";
}

.tab-section {
  grid-area: tab-section;
}

.header {
  grid-area: header;
}

.sidebar-left {
  grid-area: sidebarLeft;
}

main {
  grid-area: main;
  overflow-y: auto;
}

.sidebar-right {
  grid-area: sidebarRight;
}
</style>
