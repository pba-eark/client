<script setup>
const router = useRouter();

function navigate() {
  return navigateTo({
    path: "/sheet",
    query: {
      id: 1,
    },
  });
}

onMounted(() => {
  return navigate();
});
</script>

<template>
  <div>
    {{ $route }}
  </div>
</template>
