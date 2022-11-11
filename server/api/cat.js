export default defineEventHandler(async (event) => {
  const { fact } = await $fetch("https://catfact.ninja/fact");
  return {
    fact,
  };
});
