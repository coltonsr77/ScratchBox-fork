<script setup lang="ts">
const route = useRoute();
if (route.query.q === undefined || route.query.q === "") {
  throw createError({ statusCode: 400, statusMessage: "No query" });
}
const { data: results, pending } = await useAsyncData(
  "search-results",
  () => {
    return $fetch<
      { name: string; description: string; id: string }[]
    >(
      `/api/search?q=${route.query.q}&p=${route.query.p || "1"}`,
    );
  },
  {
    watch: [() => route.query.q, () => route.query.p],
  },
);

useHead({
  bodyAttrs: {
    class: "search-page",
  },
});
</script>
<template>
  <div class="search-content">
    <h1 v-if="pending">Loading...</h1>
    <h1 v-else-if="results?.length === 0">No results found.</h1>
    <Project
      v-else
      v-for="result in results"
      :name="result.name"
      :description='
        result.description.length > 75
          ? result.description.slice(0, 75) + "..."
          : result.description
      '
      :id="result.id"
    />
  </div>
  <div class="page-controls">
    <button
      v-if='Number(route.query.p || "1") > 1'
      @click='
        navigateTo({
          path: "/search",
          query: { q: route.query.q, p: Number(route.query.p) - 1 },
        })
      '
    >
      Back
    </button>
    <p>{{ route.query.p || "1" }}</p>
    <button
      @click='
        navigateTo({
          path: "/search",
          query: { q: route.query.q, p: Number(route.query.p || "1") + 1 },
        })
      '
    >
      Next
    </button>
  </div>
</template>
<style>
body.search-page main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.search-content {
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

  & button {
    background: var(--color-primary);
    border: none;
    color: var(--color-primary-text);
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: bold;
  }
}
</style>
