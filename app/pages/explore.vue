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
    <button
      v-if='Number(route.query.p || "1") > 1'
      @click='
        navigateTo({
          path: "/explore",
          query: { p: Number(route.query.p) - 1 },
        })
      '
    >
      Back
    </button>
    <p>{{ route.query.p || "1" }}</p>
    <button
      @click='
        navigateTo({
          path: "/explore",
          query: { p: Number(route.query.p || "1") + 1 },
        })
      '
    >
      Next
    </button>
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

  & button {
    background: #f9aa37;
    border: none;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
  }
}
</style>
