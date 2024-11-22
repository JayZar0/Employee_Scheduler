<script setup>
import { ref } from 'vue'
import { DatePicker } from 'primevue'
import Listbox from 'primevue/listbox'
import Dialog from 'primevue/dialog'

const isManager = ref(false)
const date = ref()
const selectedShift = ref()
const schedule = ref()

async function getShifts() {
  const shiftsFromDB = await fetch(`http://localhost:3004/shifts/`, {
    method: 'GET',
    headers: {
      Origin: 'https://localhost:3004/',
      // 'X-Requested-With':'',
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'EMPLOYEE_KEY'
    }
  })
  const data = await shiftsFromDB.json()
  console.log(data)
  // dump the students from the db to display on the page
  schedule.value = data
}

getShifts()
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
<!--      <Listbox v-model="selectedShift" :options="schedule" optionLabel="name" />-->
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