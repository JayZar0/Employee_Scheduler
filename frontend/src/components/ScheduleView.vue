<script setup>
import { ref } from 'vue'
import { DatePicker } from 'primevue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import ShiftForm from './ShiftForm.vue'
import { formatDate } from '../utils/date-utils.js'

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
      <div class="button-row">
        <Button @click="visible = true" label="+" id="add"
                :style="{
                width: 'fit-content',
                'margin-bottom': '10px',
                'margin-right': '10px'
              }"
        />
        <label for="add">Add Shift</label>
      </div>
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