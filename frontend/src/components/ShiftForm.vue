<script setup>
import { ref } from 'vue'
import FloatLabel from 'primevue/floatlabel'
import InputNumber from 'primevue/inputnumber'
import Listbox from 'primevue/listbox'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import { formatDate } from '../utils/date-utils.js'
import { useToast } from 'primevue'

const props = defineProps({
  shiftid: String,
  edit: Boolean,
  date: Date,
  shift: Object
})

const employee = ref(props.shift?.employeeID)
const department = ref(props.shift?.departmentID)
const date = ref(props.date)

const newShift = ref({
  startHour: props.shift?.startHour ? props.shift.startHour: 8,
  endHour: props.shift?.endHour ? props.shift.endHour: 16,
})

const employees = ref()
const departments = ref()
const errs = ref()

const toast = useToast()

async function getEmployees() {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: localStorage.getItem('bearerToken')
    }
  }
  const shiftsFromDB = await fetch(`/api/employees`, options)
  const data = await shiftsFromDB.json()
  console.log(data)
  employees.value = data
}

async function getDepartments() {
  const options = {
    method: 'GET',
    headers: {
      Authorization: localStorage.getItem('bearerToken')
    }
  }
  const shiftsFromDB = await fetch(`/api/departments`, options)
  const data = await shiftsFromDB.json()
  console.log(data)
  departments.value = data
}

getEmployees()
getDepartments()

const emit = defineEmits(['submit', 'delete'])

async function createShift() {
  newShift.value.employeeID = employee.value.id
  newShift.value.departmentID = department.value.id
  newShift.value.day = formatDate(date.value)
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'MANAGER_KEY'
    },
    body: JSON.stringify(newShift.value),
    redirect: 'follow'
  }
  try {
    const result = await fetch(`/api/shifts`, options)
    console.log(result)
    if (result.ok) {
      const data = await result.json()
      emit('submit', 'data has been updated')
      console.log(data)
    } else {
      errs.value = await result.json()
      console.log(errs.value)
    }
  } catch (e) {
    console.log(e)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'There was an error that has occurred during the upload process. Please try again.',
      life: 3000
    })
  }
}

function submissionHandler() {
  if (props.edit) {
    updateShift()
  } else {
    createShift()
  }
}

async function updateShift() {
  newShift.value.employeeID = employee.value.id
  newShift.value.departmentID = department.value.id
  newShift.value.day = formatDate(date.value)
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('bearerToken')
    },
    body: JSON.stringify(newShift.value),
    redirect: 'follow'
  }
  try {
    const result = await fetch(`/api/shifts/${props?.shiftid}`, options)
    console.log(result)
    if (result.ok) {
      const data = await result.json()
      emit('submit', 'data has been updated')
      console.log(data)
    } else {
      errs.value = await result.json()
      console.log(errs.value)
    }
  } catch (e) {
    console.log(e)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'There was an error that has occurred during the update process. Please try again.',
      life: 3000
    })
  }
}

async function deleteShift() {
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('bearerToken')
    },
    redirect: 'follow'
  }
  try {
    const result = await fetch(`/api/shifts/${props.shiftid}`, options)
    console.log(result)
    if (result.ok) {
      emit('delete', 'data has been deleted')
    } else {
      errs.value = await result.json()
      console.log(errs.value)
    }
  } catch (e) {
    console.log(e)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'There was an error that has occurred during the delete process. Please try again.',
      life: 3000
    })
  }
}
</script>

<template>
  <form>
    <div class="form-row">
      <label for="employee">Employee:</label>
      <Listbox id="employee" v-model="employee" :options="employees" optionLabel="firstName"
               :style="{
                  height:'fit-content'
               }"
      />
    </div>

    <div class="form-row">
      <label for="department">Department:</label>
      <Listbox id="department" v-model="department" :options="departments" optionLabel="name"
               :style="{
                  height:'fit-content'
               }"
      />
    </div>

    <div class="form-row">
      <FloatLabel>
        <DatePicker id="date" v-model="date" class="calendar" dateFormat="yy-mm-dd" />
        <label for="date">Date</label>
      </FloatLabel>
    </div>

    <div class="form-row">
      <FloatLabel>
        <InputNumber id="startTime" v-model="newShift.startHour" :min="1" :max="23" showButtons buttonLayout="horizontal" />
        <label for="startTime">Start</label>
      </FloatLabel>
    </div>

    <div class="form-row">
      <FloatLabel>
        <InputNumber id="endTime" v-model="newShift.endHour" :min="2" :max="24" showButtons buttonLayout="horizontal" />
        <label for="endTime">End</label>
      </FloatLabel>
    </div>

    <Toast />
    <Button :label="edit ? 'Update Shift':'Create Shift'" type="button" @click="submissionHandler" />
    <Button v-if="edit" label="Delete Shift" @click="deleteShift" />
  </form>
</template>

<style scoped>
.form-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
}

Button {
  margin-right: 10px;
}
</style>