<script setup>
import { ref } from 'vue'
import { DatePicker } from 'primevue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import ShiftForm from './ShiftForm.vue'

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0'); // Add leading zero
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${year}-${month}-${day}`; // Return formatted date
}

const isManager = ref(true)
const date = ref(new Date())
const selectedShift = ref()
const schedule = ref()
const visible = ref(false)

async function getShifts() {
  const selectedDate = formatDate(date.value)
  console.log(selectedDate)
  const shiftsFromDB = await fetch(`/api/shifts?search=${selectedDate}`, {
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
      <Button @click="visible = true" label="Add Shift"
              :style="{
                width: 'fit-content'
              }"
      />
      <Dialog v-model:visible="visible" modal header="New Shift"
              :style="{
                 height: 'fit-content',
                 width: '30vw',
                 padding: '10px',
                 'border-radius': '10px',
                 filter: 'drop-shadow(0 0 0.75rem rgba(0, 255, 33, 0.25))'
              }"
      >
        <ShiftForm />
      </Dialog>
      <DatePicker v-model="date" inline class="calendar" @valueChange="getShifts" dateFormat="yyyy-MM-dd"
                  :style="{
                    width: '100%'
                  }"
      />
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
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  margin: 30px;
  padding: 10px;
  border-radius: 15px;
}

.right {
  flex: 1 1 auto;
  margin: 30px;
  padding: 10px;
}
</style>