<script setup>
import { ref } from 'vue'
import Calendar from 'primevue/calendar'
import Listbox from 'Primevue/listbox'

const isManager = ref(false)
const date = ref()
</script>

<template>
  <div class="container">
    <Calendar v-model="date" inline />
    <Listbox></Listbox>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: auto 1fr;
}
</style>