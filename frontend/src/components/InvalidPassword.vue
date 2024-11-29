<script setup>
/*
    This component acts as a modal window to inform users that the entered password does not match what is expected
 */

import Dialog from 'primevue/dialog';
import { ref } from "vue";
import { string } from "zod";

const visible = ref(true);
const props = defineProps({
  email: string // this will be coming from the login component
})

</script>


<template>

  <Dialog v-model:visible="visible" modal header="Invalid Password" :style="{ width: '25rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-8">Incorrect password for {{ props.email }}</span>
  </Dialog>

</template>