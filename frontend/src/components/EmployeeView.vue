<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import EmployeeForm from './EmployeeForm.vue'
import ContextMenu from "primevue/contextmenu";
import {useToast} from "primevue";

const user = ref(localStorage.getItem('bearerToken'))
const employees = ref()
const selectedEmployee = ref()
const edit = ref(false)
const add = ref(false)
const employeeMenu = ref()
const employeeMenuItems = ref([
  { label: 'Update Employee', command: () => edit.value = true },
  { label: 'Delete Employee', command: async () => {
      await deleteEmployee()
      await editHandler()
    } }
])

const toast = useToast()

function showEmployeeMenu(event) {
  employeeMenu.value.show(event.originalEvent)
}

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

async function deleteEmployee() {
  try {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('bearerToken')
      },
      redirect: 'follow'
    }
    if (selectedEmployee.value.bearerToken !== localStorage.getItem('bearerToken')) {
      await fetch(`/api/employees/${selectedEmployee.value.id}`, options)
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'You are not allowed to delete yourself',
        life: 3000
      })
    }
  } catch (e) {
    console.error(e)
  }
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
  <div class="container">
    <div class="header">
      <h2>Manage Employees</h2>
    </div>
    <div class="row">
      <Button label="Register Employee" type="button" @click="add = true" />
      <Dialog v-model:visible="add" modal header="Register Employee">
        <EmployeeForm @submit="addHandler" :employee="selectedEmployee" :edit="false" />
      </Dialog>
    </div>
    <div class="employee table">
      <ContextMenu ref="employeeMenu" :model="employeeMenuItems" @hide="selectedEmployee" />
      <DataTable :value="employees" v-model:contextMenuSelection="selectedEmployee" contextMenu @row-contextmenu="showEmployeeMenu">
        <Column field="firstName" header="First Name" />
        <Column field="lastName" header="Last Name" />
        <Column header="Manager">
          <template #body="slotProps">
            {{slotProps.data.isManager ? 'Yes' : 'No'}}
          </template>
        </Column>
        <Column field="maxHours" header="Max Hours" />
        <Column>
          <template #body="slotProps">
            <Button label="Edit Employee" type="button" @click="() => {
            edit = true
            selectedEmployee = slotProps.data
          }" :disabled="user === slotProps.data.id" />
            <Dialog v-model:visible="edit" modal header="Edit Employee">
              <EmployeeForm @submit="editHandler" :employee="selectedEmployee" :edit="true" />
            </Dialog>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
div {
  margin: 15px;
}
</style>
