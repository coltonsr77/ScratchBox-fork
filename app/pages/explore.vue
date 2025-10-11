<script setup lang="ts">
const route = useRoute();

const { data: projects, pending } = await useAsyncData(
  "explore-results",
  () => {
    return $fetch<
      { name: string; description: string; id: string }[]
    >(
      `/api/projects?sort=likes&p=${route.query.p || "1"}`,
    );
  },
  {
    watch: [() => route.query.p],
  },
);

useHead({
  bodyAttrs: {
    class: "explore-page",
  },
});
</script>
<template>
  <div class="explore-content">
    <h1 v-if="pending">Loading...</h1>
    <h1 v-else-if="projects?.length === 0">No results found.</h1>
    <Project
      v-else
      v-for="project in projects"
      :name="project.name"
      :description='
        project.description.length > 75
          ? project.description.slice(0, 75) + "..."
          : project.description
      '
      :id="project.id"
    />
  </div>
  <div class="page-controls">
    <NuxtLink
      v-if='Number(route.query.p || "1") > 1'
      :to='`/explore?p=${Number(route.query.p || "1") - 1}`'
    >
      Back
    </NuxtLink>
    <p>{{ route.query.p || "1" }}</p>
    <NuxtLink :to='`/explore?p=${Number(route.query.p || "1") + 1}`'>
      Next
    </NuxtLink>
  </div>
</template>
<style>
body.explore-page main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.explore-content {
  width: 65rem;
  display: flex;
  flex-wrap: wrap;
  padding: 1rem 0;
  gap: 1rem;
}

.page-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  font-weight: bold;

  & a {
    background: var(--color-primary);
    border: none;
    color: var(--color-primary-text);
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: bold;
    text-decoration: none;
  }
}
</style>
