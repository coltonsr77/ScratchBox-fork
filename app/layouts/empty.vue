<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: "empty",
  },
});
</script>
<template>
  <slot />
</template>
<style>
body.empty {
  display: grid;
  place-content: center;
  background: var(--color-primary);
  height: 100vh;

  & * {
    text-align: center;
    color: var(--color-primary-text);
  }
}
</style>
