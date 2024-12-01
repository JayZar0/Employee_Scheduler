<script setup>
import Button from "primevue/button";
import { useStore } from "vuex";
import { useRouter } from 'vue-router';

// Access Vuex store
const store = useStore();
const router = useRouter();

// Define the logout method
function logout() {
  store.dispatch('logout', router);  // Dispatch the logout action in Vuex
  // Optionally, redirect the user or perform any other logic here
}

</script>

<template>
  <!-- Display the logout button only if the user is logged in -->
  <Button v-if="store.state.isLoggedIn" severity="danger" class="fixedbottom btnLogout" @click="logout">
    Log Out
  </Button>
</template>

<style scoped>
.fixedbottom {
  top: 0;
  right: 0;
  position: fixed;
}

.btnLogout {
  border-radius: 0;
  padding: 10px;
}
</style>
