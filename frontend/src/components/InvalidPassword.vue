<script setup>
/*
    This component acts as a modal window to inform users that the entered password does not match what is expected
 */

import Dialog from 'primevue/dialog';


import { ref } from "vue";

const visible = ref(true);
//TODO: have this default false but change to true when the password is invalid
const email = "hardcoded@email.com";


</script>

<template>

  <Dialog v-model:visible="visible" modal header="Invalid Password" :style="{ width: '25rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-8">Incorrect password for {{email}}</span>
  </Dialog>

</template>

<style scoped>

</style>