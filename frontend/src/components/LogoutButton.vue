<script>

/*
  Logout mixin used to log a user out from any interface
  */

import Button from "primevue/button";
import { useStore } from "vuex";


export default {
  components: {Button},
  methods: {
    useStore,
    logout() {
      console.log('Logging out...');
      // Add your logout logic here, such as clearing the token and redirecting the user
      //localStorage.removeItem('bearerToken');
      // If you're using Vuex, you can dispatch a logout action
      // this.$store.dispatch('logout');
    }
  }
}


</script>

<template>
  <Button v-if="useStore().state.isLoggedIn" severity="danger" class="fixedbottom btnLogout" @click="logout">Log Out</Button>
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
