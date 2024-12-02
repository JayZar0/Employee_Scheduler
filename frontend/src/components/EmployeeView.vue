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

async function getEmployees() {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'MANAGER'
    }
  }
  const response = await fetch(`/api/employees`, options)
  employees.value = await response.json()
}

async function submissionHandler() {
  edit.value = false
  await getEmployees()
}

getEmployees()
</script>

<template>
  <div>
    <h2>Manage Employees</h2>
    <DataTable :value="employees">
      <Column field="firstName" header="First Name" />
      <Column field="lastName" header="Last Name" />
      <Column field="isManager" header="Manager" />
      <Column field="maxHours" header="Max Hours" />
      <Column>
        <template #body="slotProps">
          <Button label="Edit Employee" @click="() => {
            edit = true
            selectedEmployee = slotProps.data
          }" />
          <Dialog v-model:visible="edit" modal header="Edit Employee">
            <EmployeeForm @submit="submissionHandler" :employee="selectedEmployee" />
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
