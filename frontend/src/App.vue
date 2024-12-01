<script setup>
import { RouterLink, RouterView } from 'vue-router'
import ApplicationTabs from './components/ApplicationTabs.vue'
import LogoutButton from "./components/LogoutButton.vue";
import { useStore } from "vuex";

const store = useStore();

</script>

<template>

  <div class="app">
    <!-- nav bar -->
    <ApplicationTabs v-if="store.state.isManager" class="fixedtop" />

    <!-- component being rendered -->
    <main class="content">
      <RouterView />
      <LogoutButton/>
    </main>

    <!-- Log out button shown after successful log in -->
    <LogoutButton/>
  </div>

</template>

<style scoped>

.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.fixedtop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(211, 211, 211, 0.32);
  padding: 10px;
}

.content {
  flex: 1; /* Takes up remaining space */
  overflow-y: auto; /* Enable scrolling if content overflows */
  margin-top: 60px; /* Adjust for the height of the tab bar */
}
</style>
