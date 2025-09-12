<script setup lang="ts">
import type { NuxtError } from "#app";

const { error } = defineProps({
  error: Object as () => NuxtError,
});

const { currentTheme } = useTheme();

const themeClass = computed(() => `theme-${currentTheme.value}`);

useHead({
  bodyAttrs: {
    class: ["error-page", themeClass],
  },
});
</script>
<template>
  <NuxtLayout name="default">
    <h1>{{ error?.statusCode }} - {{ error?.statusMessage }}</h1>
    <NuxtLink to="/">Go back home</NuxtLink>
  </NuxtLayout>
</template>
<style>
body.error-page main {
  display: grid;
  place-content: center;
  height: calc(100vh - 4rem);
  text-align: center;
  gap: 1rem;
}
</style>
