<script setup>
import { ref } from 'vue'
import { DatePicker, useToast } from 'primevue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import Select from 'primevue/select'
import ProgressSpinner from 'primevue/progressspinner'
import ShiftForm from './ShiftForm.vue'
import { formatDate, formatTime } from '../utils/date-utils.js'

const isManager = ref(true)
const date = ref(new Date())
const schedule = ref()
const create = ref(false)
const editing = ref(false)
const selectedShift = ref()
const departments = ref()
const department = ref()

const toast = useToast()
const loading = ref(false)

async function getShifts() {
  loading.value = true
  const departmentFilter = department.value?.id ? department.value.id: ''
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: isManager ? 'MANAGER_KEY': 'EMPLOYEE_KEY'
    },
    timeout: 1000 * 60
  }
  const selectedDate = formatDate(date.value)
  console.log(selectedDate)
  console.log(departmentFilter)
  try {
    const shiftsFromDB = await fetch(`/api/shifts?selecteddate=${selectedDate}&deptfilter=${departmentFilter}`, options)
    const data = await shiftsFromDB.json()
    console.log(data)
    schedule.value = data
  } catch (e)
  {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error has occurred while trying to load the specified date.',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

async function getDepartments() {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'MANAGER_KEY'
    }
  }
  const shiftsFromDB = await fetch(`/api/departments`, options)
  const data = await shiftsFromDB.json()
  console.log(data)
  departments.value = data
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

getShifts()
getDepartments()
</script>

<template>
  <div class="container">
    <div class="left">
      <div class="button-row" v-if="isManager">
        <Button @click="create = true" label="+" id="add"
                :style="{
                width: 'fit-content',
                'margin-bottom': '10px',
                'margin-right': '10px',
                'z-index': '0'
              }"
        />
        <label for="add">Add Shift</label>
      </div>
      <Toast />
      <Dialog v-model:visible="create" modal header="New Shift" @hide="create = false"
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
                    width: '100%',
                    height: '100%'
                  }"
      />
    </div>
    <div class="right">
      <div class="select-box">
        <Select name="filter" id="filter" :options="departments" v-model="department"
                optionLabel="name" placeholder="Department Filter" showClear @change="getShifts" />
      </div>
      <DataTable :value="schedule">
        <template #header>
          <h5>Shifts on {{formatDate(date)}}</h5>
        </template>
        <Column header="Name">
          <template #body="slotProps">
            {{slotProps.data.employeeID?.firstName || 'Unassigned'}}
            <ProgressSpinner v-if="loading" />
          </template>
        </Column>
        <Column field="departmentID.name" header="Department"></Column>
        <Column field="day" header="Date"></Column>
        <Column header="Start">
          <template #body="slotProps">
            {{formatTime(slotProps.data.startHour)}}
          </template>
        </Column>
        <Column header="End">
          <template #body="slotProps">
            {{formatTime(slotProps.data.endHour)}}
          </template>
        </Column>
        <Column v-if="isManager">
          <template #body="slotProps">
            <Button label="Edit Shift" type="button" @click="() => {
              editing = true
              selectedShift = slotProps.data
            }" />
            <Dialog v-model:visible="editing" modal header="Editing Shift" @hide="editing = false"
                    :style="{
                 height: 'fit-content',
                 width: '30vw',
                 padding: '10px',
                 'border-radius': '10px',
                 filter: 'drop-shadow(0 0 0.75rem rgba(0, 255, 33, 0.25))'
              }"
            >
              <ShiftForm :shiftid="selectedShift.id" :date="date" :shift="selectedShift" :edit="true" @submit="updateView" @delete="deleteView" />
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

.left  {
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

.button-row {
  text-align: left;
}

.select-box {
  display: block;
  margin: 20px;
  text-align: left;
}
</style>
