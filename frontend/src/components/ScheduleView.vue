<script setup>
import { ref } from 'vue'
import { Calendar } from 'primevue/calendar'

const isManager = ref(false)
</script>

<template>
  <Calendar inline showWeek />
</template>

<style scoped>

</style>