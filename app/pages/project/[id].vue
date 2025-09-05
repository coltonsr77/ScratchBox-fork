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

const name = ref("");
watch(project, (newProject) => {
  if (newProject?.name) {
    name.value = newProject.name;
  }
}, { immediate: true });

const description = ref("");
watch(project, (newProject) => {
  if (newProject?.description) {
    description.value = newProject.description;
  }
}, { immediate: true });

const isPrivate = ref(true);
watch(project, (newProject) => {
  if (newProject?.private !== undefined) {
    isPrivate.value = newProject.private;
  }
}, { immediate: true });

const platforms = reactive(
  (project.value?.platforms as (keyof typeof platformsMap)[])
    .toSorted((a, b) =>
      Object.keys(platformsMap).indexOf(a) -
      Object.keys(platformsMap).indexOf(b)
    ) as (keyof typeof platformsMap)[],
);

const user = await useCurrentUser();

const editing = ref(false);

const upload = useTemplateRef("upload") as Ref<HTMLInputElement>;
const { handleFileInput, files } = useFileStorage({ clearOldFiles: true });

const onLike = async () => {
  await $fetch(`/api/project/${projectId}/like`, {
    method: liked.value ? "DELETE" : "POST",
    headers: useRequestHeaders(["cookie"]),
  });

  project.value!.likes += liked.value ? -1 : 1;
  liked.value = !liked.value;
};

const nameInput = useTemplateRef("nameInput") as Ref<HTMLTextAreaElement>;

const resizeNameInput = () => {
  nextTick(() => {
    nameInput.value.style.height = "auto";
    nameInput.value.style.height = `${nameInput.value.scrollHeight}px`;
  });
};

const addOrRemovePlatform = (platform: keyof typeof platformsMap) => {
  if (platforms.includes(platform)) {
    platforms.splice(platforms.indexOf(platform), 1);
    return;
  }
  platforms.push(platform);
  platforms.sort((a, b) =>
    Object.keys(platformsMap).indexOf(a) - Object.keys(platformsMap).indexOf(b)
  );
};

const save = async () => {
  await $fetch(`/api/project/${projectId}/edit`, {
    method: "POST",
    headers: useRequestHeaders(["cookie"]),
    body: {
      file: files.value[0],
      name: name.value,
      description: description.value,
      platforms: platforms,
      private: isPrivate.value,
    },
  });
  editing.value = false;
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
      <textarea
        v-model="name"
        :disabled="!editing"
        @keydown.enter.prevent
        @input="resizeNameInput"
        ref="nameInput"
        rows="1"
      />
      <div class="platforms" v-if="platforms?.length > 0 || editing">
        <p
          v-for="(name, platform) in platformsMap"
          v-show="platforms.includes(platform) || editing"
        >
          {{ name }} <Icon
            v-if="editing"
            :name='
              platforms.includes(platform)
                ? "ri:close-line"
                : "ri:add-line"
            '
            @click="addOrRemovePlatform(platform)"
          />
        </p>
      </div>
      <p>
        <img :src="profilePicture"> By <NuxtLink
          :to="`/user/${project?.user}`"
        >{{ project?.user }}</NuxtLink>

        <template v-if="user.loggedIn && user.username == project?.user">
          <button v-if="!editing" @click="editing = true">
            <Icon name="ri:edit-line" /> Edit
          </button>
          <template v-else>
            <button @click="isPrivate = !isPrivate" class="private">
              <Icon name="ri:user-line" /> {{
                isPrivate ? "Make Public" : "Make Private"
              }}
            </button>
            <button @click="save">
              <Icon name="ri:save-line" /> Save
            </button>
          </template>
        </template>
      </p>
      <img src="/default-thumbnail.png" />
    </div>
    <div class="right">
      <h2>Description</h2>
      <textarea
        v-if="project"
        :disabled="!editing"
        v-model="description"
      ></textarea>
      <button class="likes" @click="onLike">
        <Icon :name='liked ? "ri:thumb-up-fill" : "ri:thumb-up-line"' /> {{
          project?.likes
        }}
      </button>
      <a class="download" :href="`/api/project/${projectId}/download`" download>
        <Icon name="ri:download-line" />
        Download
      </a>
      <button class="upload" v-if="editing" @click="upload.click()">
        <Icon name="ri:upload-line" /> Upload
      </button>
      <input
        type="file"
        hidden
        ref="upload"
        accept=".sb3"
        @input="handleFileInput"
      />
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
        border-radius: 2rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;

        & span {
          cursor: pointer;
        }
      }
    }

    & > img {
      border-radius: 1rem;
    }

    & p:has(img) {
      display: flex;
      align-items: center;
      gap: 0.5ch;
      position: relative;

      & img {
        height: 3rem;
        border-radius: 0.75rem;
        margin-right: calc(0.75rem - 0.5ch);
      }

      & button {
        right: 0;
        top: 50%;
        translate: 0 -50%;
        height: 2rem;
      }

      & .private {
        right: 5rem;
      }
    }

    & textarea {
      background: none;
      border: none;
      color: #000;
      font-weight: bold;
      font-size: 2rem;
      cursor: text;
      resize: none;
    }
  }

  & .right {
    background: #dfdfdf;
    padding: 1rem;
    border-radius: 1rem;
    position: relative;
    width: 50%;

    & h2 {
      margin-bottom: 1rem;
    }

    & textarea {
      background: none;
      width: 100%;
      height: calc(100% - 6rem);
      border: none;
      resize: none;
      color: inherit;
      cursor: text;
    }
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
    font-weight: bold;

    &.likes {
      left: 1rem;
    }

    &.download, &.upload {
      right: 1rem;
    }

    &.upload {
      bottom: 3.5rem;
    }
  }
}
</style>
