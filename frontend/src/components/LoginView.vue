<script setup>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';

const value = ref(null);

</script>

<template>
  <h2>Test</h2>

  <template>
    <div class="card flex justify-center">
      <InputText type="text" v-model="value" />
    </div>
  </template>

  <InputText type="text" v-model="value" />
  <InputText type="text" v-model="value" />
  <Button label="login"></Button>
</template>

<style scoped>

</style>