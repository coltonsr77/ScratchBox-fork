<script setup lang="ts">
const project = await $fetch(`/api/project/${useRoute().params.id}`);
const profilePicture = await $fetch(`/api/pfp/${project.user}`);

useHead({
  bodyAttrs: {
    class: "project-page",
  },
});
</script>
<template>
  <div class="project-section">
    <div class="left">
      <h1>{{ project.name }}</h1>
      <p>
        <img :src="profilePicture"> By <NuxtLink
          :to="`/user/${project.user}`"
        >{{ project.user }}</NuxtLink>
      </p>
      <img src="/default-thumbnail.png" />
    </div>
    <div class="right">
      <h2>Description</h2>
      <p>{{ project.description }}</p>
    </div>
  </div>
</template>
<style>
body.project-page main {
  display: flex;
  justify-content: center;
}

.project-section {
  width: 65rem;
  display: flex;
  gap: 2rem;
  padding: 2rem;

  & .left {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    & > img {
      border-radius: 1rem;
    }

    & p:has(img) {
      display: flex;
      align-items: center;
      gap: 0.5ch;

      & img {
        height: 3rem;
        border-radius: 0.75rem;
        margin-right: calc(0.75rem - 0.5ch);
      }
    }
  }

  & .right {
    background: #dfdfdf;
    padding: 1rem;
    border-radius: 1rem;

    & h2 {
      margin-bottom: 1rem;
    }
  }
}
</style>
