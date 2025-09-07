<script setup lang="ts">
import md from "~/utils/markdown";

const props = defineProps<{ markdown: string }>();

const renderedMarkdown = computed(() => md.render(props.markdown));
</script>
<template>
  <div v-html="renderedMarkdown"></div>
</template>
