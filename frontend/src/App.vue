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
    <header class="container fixedtop">
      <ApplicationTabs v-if="store.state.isManager" />
      <!-- Log out button shown after successful log in -->
      <LogoutButton />
    </header>
    

    <!-- component being rendered -->
    <main class="content m-3">
      <RouterView />
      <LogoutButton/>
    </main>

    
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
  z-index: 10;
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
