<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import EmployeeForm from './EmployeeForm.vue'

const search = ref()
const employees = ref()
const selectedEmployee = ref()
const edit = ref(false)
const add = ref(false)

/**
 * This method will be used to grab the employees from the database
 * @returns {Promise<void>}
 */
async function getEmployees() {
  const options = {
    method: 'GET',
    headers: {
      Authorization: localStorage.getItem('bearerToken')
    }
  }
  const response = await fetch(`/api/employees`, options)
  employees.value = await response.json()
}

/**
 * This method will be used to handle the event of an employee being edited
 * @returns {Promise<void>}
 */
async function editHandler() {
  edit.value = false
  await getEmployees()
}

/**
 * This method will be used to handle the event of an employee being added to
 * the employee table
 * @returns {Promise<void>}
 */
async function addHandler() {
  add.value = false
  await getEmployees()
}

getEmployees()
</script>

<template>
  <div>
    <h2>Manage Employees</h2>
    <Button label="Register Employee" type="button" @click="add = true" />
    <Dialog v-model:visible="add" modal header="Register Employee">
      <EmployeeForm @submit="addHandler" :employee="selectedEmployee" :edit="false" />
    </Dialog>
    <DataTable :value="employees">
      <Column field="firstName" header="First Name" />
      <Column field="lastName" header="Last Name" />
      <Column field="isManager" header="Manager" />
      <Column field="maxHours" header="Max Hours" />
      <Column>
        <template #body="slotProps">
          <Button label="Edit Employee" type="button" severity="secondary" @click="() => {
            edit = true
            selectedEmployee = slotProps.data
          }" />
          <Dialog v-model:visible="edit" modal header="Edit Employee">
            <EmployeeForm @submit="editHandler" :employee="selectedEmployee" :edit="true" />
          </Dialog>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
header {
  display: block;
}
</style>
