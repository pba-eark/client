<script>
export default {
  async setup() {
    const data = reactive({
      nWord: "naga",
    });

    /* If using async setup(), make sure to register lifecycle hooks before the first await statement. */
    onMounted(() => {
      console.log("app mounted");
    });

    const getCatFact = async () => {
      // const fetchData = await $fetch("/api/cat");
      const fetchData = await $fetch("https://localhost:7125/api/test");
      console.log("Cat fact", fetchData);
    };

    return {
      data,
      getCatFact,
    };
  },
};
</script>

<template>
  <div>
    <nav>
      <NuxtLink to="/">home</NuxtLink>
      <NuxtLink to="/about">page 1</NuxtLink>
      <NuxtLink to="/login">Login</NuxtLink>
    </nav>
    <button @click="getCatFact">Get cat fact</button>
    <p>nWord: {{ data.nWord }}</p>
    <input type="text" v-model="data.nWord" />
    <LazyNuxtPage />
  </div>
</template>
