<script setup>
import { ref } from 'vue'
import { DatePicker } from 'primevue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import ShiftForm from "./ShiftForm.vue";

const isManager = ref(true)
const date = ref()
const selectedShift = ref()
const schedule = ref()
const visible = ref(false)

async function getShifts() {
  const shiftsFromDB = await fetch(`/api/shifts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: isManager ? 'MANAGER_KEY': 'EMPLOYEE_KEY'
    }
  })
  const data = await shiftsFromDB.json()
  console.log(data)
  schedule.value = data
}

getShifts()
</script>

<template>
  <div class="container">
    <div class="left">
      <Button @click="visible = true" label="Add Shift" />
      <Dialog v-model:visible="visible" modal header="New Shift"
              :style="{
                'background-color': 'grey',
                 height: '30vh',
                 width: '30vw',
                 padding: '10px',
                 'border-radius': '10px',
                 filter: 'drop-shadow(0 0 0.75rem crimson)'
              }"
      >
        <ShiftForm />
      </Dialog>
      <DatePicker v-model="date" inline class="calendar" />
    </div>
    <div class="right">
      <select name="filter" id="filter">
        <option value="test">Test Value</option>
        <option value="test2">Test Value#2</option>
      </select>
      <DataTable :value="schedule">
        <Column field="employeeID" header="Name"></Column>
        <Column field="departmentID" header="Department"></Column>
        <Column field="day" header="Date"></Column>
        <Column field="startHour" header="Start"></Column>
        <Column field="endHour" header="End"></Column>
      </DataTable>
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
  background-color: black;
  border-radius: 15px;
}

.right {
  flex: 1 1 auto;
  margin: 30px;
  padding: 10px;
  border: 3px solid white;
  border-radius: 15px;
}

@media (prefers-color-scheme: light) {
  .right {
    border: 3px solid black;
  }
}
</style>