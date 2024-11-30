<script setup>
import { ref } from 'vue'
import { DatePicker } from 'primevue'
import Listbox from 'primevue/listbox'
import Dialog from 'primevue/dialog'

const date = ref()
const selectedShift = ref()
const schedule = ref([
  { name: 'Gordon', start: '6am', end: '2pm' },
  { name: 'Paula', start: '8am', end: '4pm' },
  { name: 'Guy', start: '10am', end: '6pm' },
  { name: 'Papa', start: '1am', end: '9pm' },
  { name: 'Tim', start: '5am', end: '9pm' }
])
</script>

<template>
  <div class="container">
    <div class="left">
      <DatePicker v-model="date" inline class="calendar" />
    </div>
    <div class="right">
      <select name="filter" id="filter">
        <option value="test">Test Value</option>
        <option value="test2">Test Value#2</option>
      </select>
      <Listbox v-model="selectedShift" :options="schedule" optionLabel="name" />
    </div>
  </div>
</template>

<style scoped>
.calendar {
  height: fit-content;
  width: 75%;
}

.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.left {
  flex: 1 1 auto;
  margin: 30px;
  padding: 10px;
}

.right {
  flex: 1 1 auto;
  margin: 30px;
  padding: 10px;
  border: 3px solid white;
}

@media (prefers-color-scheme: light) {
  .right {
    border: 3px solid black;
  }
}
</style>
