<script setup>
import { RouterLink, RouterView } from 'vue-router'
import LoginView from "./components/LoginView.vue";
</script>

<template>
  <nav>
    <RouterLink to="/">Schedule</RouterLink>
    <RouterLink to="/employees">Employees</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
</style>
