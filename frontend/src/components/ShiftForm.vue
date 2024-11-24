<script setup>
import { ref } from 'vue'
import FloatLabel from 'primevue/floatlabel'
import InputNumber from 'primevue/inputnumber'
import Listbox from 'primevue/listbox'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'

const employee = ref()
const department = ref()
const date = ref()
const start = ref()
const end = ref()

const employees = ref()
const departments = ref()

async function getEmployees() {
  const shiftsFromDB = await fetch(`/api/employees`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'MANAGER_KEY'
    }
  })
  const data = await shiftsFromDB.json()
  console.log(data)
  employees.value = data
}

async function getDepartments() {
  const shiftsFromDB = await fetch(`/api/departments`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'MANAGER_KEY'
    }
  })
  const data = await shiftsFromDB.json()
  console.log(data)
  departments.value = data
}

getEmployees()
getDepartments()
</script>

<template>
  <form action="/api/shifts">
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
        <DatePicker id="date" v-model="date" class="calendar" />
        <label for="date">Date</label>
      </FloatLabel>
    </div>

    <div class="form-row">
      <span>Time in military time</span>
      <FloatLabel>
        <InputNumber id="startTime" v-model="start" :min="1" :max="24" showButtons buttonLayout="horizontal" />
        <label for="startTime">Start</label>
      </FloatLabel>

      <FloatLabel>
        <InputNumber id="endTime" v-model="end" :min="1" :max="24" showButtons buttonLayout="horizontal" />
        <label for="endTime">End</label>
      </FloatLabel>
    </div>


    <Button label="submit" type="submit" />
  </form>
</template>

<style scoped>
.form-row {
  display: flex;
  flex-direction: column;
}
</style>