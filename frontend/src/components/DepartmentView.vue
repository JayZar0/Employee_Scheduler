<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import ContextMenu from 'primevue/contextmenu'
import Toast from 'primevue/toast'
import { useToast } from 'primevue'
import DepartmentForm from './DepartmentForm.vue'

const departments = ref()
const selectedDepartment = ref()
const edit = ref(false)
const add = ref(false)
const departmentMenu = ref()
const departmentMenuItems = ref([
  { label: 'Update Position', command: () => edit.value = true },
  { label: 'Delete Position', command: async () => {
      await deleteEmployee()
      await editHandler()
    } }
])

const toast = useToast()

function showEmployeeMenu(event) {
  departmentMenu.value.show(event.originalEvent)
}

/**
 * This method will be used to grab the departments from the database
 * @returns {Promise<void>}
 */
async function getEmployees() {
  const options = {
    method: 'GET',
    headers: {
      Authorization: localStorage.getItem('bearerToken')
    }
  }
  const response = await fetch(`/api/departments`, options)
  departments.value = await response.json()
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

    await fetch(`/api/departments/${selectedDepartment.value.id}`, options)
  } catch (e) {
    console.error(e)
  }
}

/**
 * This method will be used to handle the event of an department being edited
 * @returns {Promise<void>}
 */
async function editHandler() {
  edit.value = false
  await getEmployees()
}

/**
 * This method will be used to handle the event of an department being added to
 * the department table
 * @returns {Promise<void>}
 */
async function addHandler() {
  add.value = false
  await getEmployees()
}

getEmployees()
</script>

<template class="m-4">
  <div class="container">
    <div class="header">
      <h2>Manage Departments</h2>
    </div>
    <div class="row">
      <Button label="Create Department" type="button" @click="add = true" />
      <Dialog v-model:visible="add" modal header="Create Department">
        <DepartmentForm @submit="addHandler" :department="selectedDepartment" :edit="false" />
      </Dialog>
    </div>
    <div class="department table">
      <Toast />
      <ContextMenu ref="departmentMenu" :model="departmentMenuItems" @hide="selectedEmployee" />
      <DataTable :value="departments" v-model:contextMenuSelection="selectedEmployee" removableSort contextMenu @row-contextmenu="showEmployeeMenu">
        <Column field="name" header="Department Name" sortable="true" />
        <Column field="wage" header="Wage" sortable="true" />
        <Column>
          <template #body="slotProps">
            <Button label="Edit Department" type="button" @click="() => {
            edit = true
            selectedDepartment = slotProps.data
          }"/>
            <Dialog v-model:visible="edit" modal header="Edit Department">
              <DepartmentForm @submit="editHandler" :department="selectedDepartment" :edit="true" />
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