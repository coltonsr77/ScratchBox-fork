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
  background: #f9aa37;
  height: 100vh;

  & * {
    text-align: center;
    color: #fff;
  }
}
</style>
