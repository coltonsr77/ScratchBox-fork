<script setup lang="ts">
const route = useRoute();

const projects = await $fetch<
  {
    public: { name: string; description: string; id: string }[];
    private?: { name: string; description: string; id: string }[];
  }
>(`/api/user/${route.params.name}/projects`, {
  headers: useRequestHeaders(["cookie"]),
});

const profilePicture = await $fetch(`/api/user/${route.params.name}/picture`);

useHead({
  bodyAttrs: {
    class: "profile-page",
  },
});
</script>
<template>
  <div class="profile">
    <h1>
      <img :src="profilePicture" /> {{
        projects.private ? "Your" : `${route.params.name}'s`
      }} Profile
    </h1>
    <h2>Public Projects</h2>
    <div class="user-projects">
      <Project
        v-for="project in projects.public"
        :name="project.name"
        :description='
          project.description.length > 75
            ? project.description.slice(0, 75) + "..."
            : project.description
        '
        :id="project.id"
      />
    </div>
    <template v-if="projects.private">
      <h2>Private Projects</h2>
      <div class="user-projects">
        <Project
          v-for="project in projects.private"
          :name="project.name"
          :description='
            project.description.length > 75
              ? project.description.slice(0, 75) + "..."
              : project.description
          '
          :id="project.id"
        />
      </div>
    </template>
  </div>
</template>
<style>
body.profile-page main {
  display: flex;
  justify-content: center;
}

.profile {
  padding: 1rem 0;
  width: 65rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  & h1 {
    display: flex;
    align-items: center;
    gap: 0.5ch;
    margin-bottom: 2rem;

    & img {
      border-radius: 0.75rem;
      height: 3rem;
    }
  }
}

.user-projects {
  display: flex;
  gap: 1rem;
}
</style>
