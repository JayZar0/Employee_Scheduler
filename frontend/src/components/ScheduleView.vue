<script setup>
import { ref } from 'vue'
import {DatePicker, useToast} from 'primevue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import ShiftForm from './ShiftForm.vue'
import { formatDate } from '../utils/date-utils.js'

const isManager = ref(true)
const date = ref(new Date())
const schedule = ref()
const create = ref(false)
const editing = ref(false)

const toast = useToast()

async function getShifts() {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: isManager ? 'MANAGER_KEY': 'EMPLOYEE_KEY'
    }
  }
  const selectedDate = formatDate(date.value)
  console.log(selectedDate)
  const shiftsFromDB = await fetch(`/api/shifts?search=${selectedDate}`, options)
  const data = await shiftsFromDB.json()
  console.log(data)
  schedule.value = data
}

function addView() {
  create.value = false
  getShifts()
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'New shift has been added.',
    life: 3000
  })
}

function updateView() {
  editing.value = false
  getShifts()
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Shift has been updated successfully.',
    life: 3000
  })
}

function deleteView() {
  editing.value = false
  getShifts()
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Shift has been deleted successfully.',
    life: 3000
  })
}

function onRightClick(e) {
  menu.value.show(e);
}

getShifts()
</script>

<template>
  <div class="container">
    <div class="left">
      <div class="button-row">
        <Button @click="create = true" label="+" id="add"
                :style="{
                width: 'fit-content',
                'margin-bottom': '10px',
                'margin-right': '10px'
              }"
        />
        <label for="add">Add Shift</label>
      </div>
      <Toast />
      <Dialog v-model:visible="create" modal header="New Shift"
              :style="{
                 height: 'fit-content',
                 width: 'fit-content',
                 padding: '10px',
                 'border-radius': '10px',
                 filter: 'drop-shadow(0 0 0.75rem rgba(0, 255, 33, 0.25))'
              }"
      >
        <ShiftForm @submit="addView" :date="date" />
      </Dialog>
      <DatePicker v-model="date" inline class="calendar" @valueChange="getShifts" dateFormat="yy-mm-dd"
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
        <template #header>
          <h5>Shifts on {{formatDate(date)}}</h5>
        </template>
        <Column field="employeeID.firstName" header="Name"></Column>
        <Column field="departmentID.name" header="Department"></Column>
        <Column field="day" header="Date"></Column>
        <Column field="startHour" header="Start"></Column>
        <Column field="endHour" header="End"></Column>
        <Column>
          <template #body="slotProps">
            <Button label="Edit Shift" type="button" @click="editing = true" />
            <Dialog v-model:visible="editing" modal header="Editing Shift"
                    :style="{
                 height: 'fit-content',
                 width: '30vw',
                 padding: '10px',
                 'border-radius': '10px',
                 filter: 'drop-shadow(0 0 0.75rem rgba(0, 255, 33, 0.25))'
              }"
            >
              <ShiftForm :shiftid="slotProps.data.id" :date="slotProps.data.day" :shift="slotProps.data" :edit="true" @submit="updateView" @delete="deleteView" />
            </Dialog>
          </template>
        </Column>
      </DataTable>
<!--      <ContextMenu ref="menu" :model="shiftOptions" />-->
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