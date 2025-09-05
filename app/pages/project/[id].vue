<script setup lang="ts">
const platformsMap = {
  "scratch": "Scratch",
  "turbowarp": "TurboWarp",
  "3ds": "3DS",
  "wiiu": "Wii U",
  "switch": "Switch",
  "wii": "Wii",
  "gamecube": "GameCube",
  "vita": "Vita",
};

const projectId = useRoute().params.id;
const { data: project } = await useFetch<
  {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    private: boolean;
    user: string;
    likes: number;
    platforms: typeof platformsMap[keyof typeof platformsMap][];
  }
>(`/api/project/${projectId}`);
const profilePicture = await $fetch(`/api/pfp/${project.value?.user}`);
const { data: liked } = await useFetch<boolean>(
  `/api/project/${projectId}/liked`,
  {
    headers: useRequestHeaders(["cookie"]),
  },
);

const platforms = (project.value?.platforms as (keyof typeof platformsMap)[])
  .toSorted((a, b) =>
    Object.keys(platformsMap).indexOf(a) - Object.keys(platformsMap).indexOf(b)
  ).map((platform) =>
    platformsMap[platform]
  ) as typeof platformsMap[keyof typeof platformsMap][];

const onLike = async () => {
  await $fetch(`/api/project/${projectId}/like`, {
    method: liked.value ? "DELETE" : "POST",
    headers: useRequestHeaders(["cookie"]),
  });

  project.value!.likes += liked.value ? -1 : 1;
  liked.value = !liked.value;
};

useHead({
  bodyAttrs: {
    class: "project-page",
  },
});
</script>
<template>
  <div class="project-section">
    <div class="left">
      <h1>{{ project?.name }}</h1>
      <div class="platforms" v-if="platforms?.length > 0">
        <p v-for="platform in platforms">{{ platform }}</p>
      </div>
      <p>
        <img :src="profilePicture"> By <NuxtLink
          :to="`/user/${project?.user}`"
        >{{ project?.user }}</NuxtLink>
      </p>
      <img src="/default-thumbnail.png" />
    </div>
    <div class="right">
      <h2>Description</h2>
      <p>{{ project?.description }}</p>
      <button class="likes" @click="onLike">
        <Icon :name='liked ? "ri:thumb-up-fill" : "ri:thumb-up-line"' /> {{
          project?.likes
        }}
      </button>
      <a class="download" :href="`/api/project/${projectId}/download`" download>
        <Icon name="ri:download-line" />
        Download
      </a>
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
    width: 50%;

    & .platforms {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;

      & p {
        background: #dfdfdf;
        padding: 0.5rem 1rem;
        gap: 1rem;
        border-radius: 2rem;
      }
    }

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
    position: relative;

    & h2 {
      margin-bottom: 1rem;
    }

    & button, & a.download {
      background: #f9aa37;
      color: #fff;
      border: none;
      font-size: 1rem;
      padding: 0.5rem;
      border-radius: 1rem;
      display: flex;
      gap: 0.5rem;
      cursor: pointer;
      position: absolute;
      bottom: 1rem;
      text-decoration: none;

      &.likes {
        left: 1rem;
      }

      &.download {
        right: 1rem;
      }
    }
  }
}
</style>
