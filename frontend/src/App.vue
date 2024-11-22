<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <ul class="navlist">
      <li><RouterLink to="/">Schedule</RouterLink></li>
      <li><RouterLink to="/employees">Employees</RouterLink></li>
    </ul>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
.navlist {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.navlist > li {
  margin: 10px;
}
</style>
