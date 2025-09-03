<script setup lang="ts"></script>
<template>
  <nav>
    <NuxtLink to="/"><img
        src="/scratchbox-logo-full.svg"
        alt="ScratchBox"
      /></NuxtLink>
    <NuxtLink to="/upload">Upload</NuxtLink>
    <NuxtLink to="/explore">Explore</NuxtLink>
    <input type="search" placeholder="Search..." />
    <NuxtLink to="/mystuff">My Projects</NuxtLink>
    <NuxtLink to="/account">Account (placeholder)</NuxtLink>
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
