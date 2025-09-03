<script setup lang="ts">
const authRedirect = btoa(`${useRequestURL().origin}/api/auth`);

const { data: userData } = await useAsyncData(
  "user",
  () =>
    $fetch("/api/auth/me", {
      headers: useRequestHeaders(["cookie"]),
    }).catch(() => null),
);

const loggedIn = computed(() => !!userData.value?.user);
const username = computed(() =>
  (userData.value?.user as { username: string }).username || ""
);
</script>
<template>
  <nav>
    <NuxtLink to="/"><img
        src="/scratchbox-logo-full.svg"
        alt="ScratchBox"
      /></NuxtLink>
    <NuxtLink to="/explore">Explore</NuxtLink>
    <input type="search" placeholder="Search..." />
    <template v-if="loggedIn">
      <NuxtLink to="/upload">Upload</NuxtLink>
      <NuxtLink to="/mystuff">My Projects</NuxtLink>
      <a href="/api/auth/logout">Log Out</a>
    </template>
    <NuxtLink
      :to="`https://auth.itinerary.eu.org/auth/?redirect=${authRedirect}&name=ScratchBox`"
      v-else
    >Log In</NuxtLink>
  </nav>
</template>
<style>
nav {
  display: flex;
  background: #f9aa37;
  height: 4rem;
  justify-content: center;

  & img {
    height: 100%;
  }

  & * {
    color: #fff;
    font-weight: bold;
    font-size: 1rem;
  }

  & > a {
    padding: 1rem;
    text-decoration: none;
    display: flex;
    align-items: center;
    height: 100%;
    transition: 50ms background ease-in-out;
    &:hover {
      background: rgba(0, 0, 0, 0.25);
    }
  }

  & > input {
    background: rgba(0, 0, 0, 0.25);
    border: none;
    margin: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    width: 30rem;
  }
}
</style>
