<script setup lang="ts">
const props = defineProps<{ name: string; description: string; id: string }>();
</script>
<template>
  <NuxtLink :to="`/project/${props.id}`" class="project-card">
    <object
      :data="`/api/project/${props.id}/thumbnail`"
      type="image/png"
    >
      <nuxt-img src="/default-thumbnail.png" />
    </object>
    <h2>{{ props.name }}</h2>
    <MarkdownText
      v-if='props.description !== ""'
      :markdown="props.description"
    />
  </NuxtLink>
</template>
<style>
.project-card {
  background: var(--color-secondary-background);
  width: calc(65rem / 3 - 1rem * 3);
  color: var(--color-text);
  font-weight: unset;
  text-decoration: none;
  padding: 1rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  & object, & img {
    width: 100%;
    border-radius: 1rem;
  }
}
</style>
