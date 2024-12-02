<script setup>
import { RouterView } from 'vue-router'
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
  background: rgb(239, 243, 247);
  padding: 10px;
}

.content {
  flex: 2;
  display: flex;
  overflow-y: auto;
  justify-content: center;
  align-items: center;
  padding-bottom: 100px;
}
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
