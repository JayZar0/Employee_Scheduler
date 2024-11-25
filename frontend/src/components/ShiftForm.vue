<script setup>
import { ref } from 'vue'
import FloatLabel from 'primevue/floatlabel'
import InputNumber from 'primevue/inputnumber'
import Listbox from 'primevue/listbox'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import { formatDate } from '../utils/date-utils.js'

const employee = ref()
const department = ref()

const newShift = ref({
  day: formatDate(new Date()),
  startHour: 1,
  endHour: 1,
})

const employees = ref()
const departments = ref()

async function getEmployees() {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'MANAGER_KEY'
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
      Authorization: 'MANAGER_KEY'
    }
  }
  const shiftsFromDB = await fetch(`/api/departments`, options)
  const data = await shiftsFromDB.json()
  console.log(data)
  departments.value = data
}

async function createShift() {
  newShift.value.employeeID = employee.value.id
  newShift.value.departmentID = department.value.id
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
      console.log(data)
    } else {
      const data = await result.json()
      console.log(data)
    }
  } catch (e) {
    console.log(e)
  }
}

getEmployees()
getDepartments()
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
        <DatePicker id="date" v-model="newShift.day" class="calendar" dateFormat="yy-mm-dd" />
        <label for="date">Date</label>
      </FloatLabel>
    </div>

    <div class="form-row">
      <FloatLabel>
        <InputNumber id="startTime" v-model="newShift.startHour" :min="1" :max="24" showButtons buttonLayout="horizontal" />
        <label for="startTime">Start</label>
      </FloatLabel>
    </div>

    <div class="form-row">
      <FloatLabel>
        <InputNumber id="endTime" v-model="newShift.endHour" :min="1" :max="24" showButtons buttonLayout="horizontal" />
        <label for="endTime">End</label>
      </FloatLabel>
    </div>

    <Button label="Submit" type="submit" @click="createShift" />
  </form>
</template>

<style scoped>
.form-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
}
</style>