<script setup>
import { ref, defineEmits, defineProps } from 'vue'
import Button from 'primevue/button'
import FloatLabel from 'primevue/floatlabel'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Toast from 'primevue/toast'
import ToggleButton from 'primevue/togglebutton'
import { useToast } from 'primevue'

const toast = useToast()

const props = defineProps({
  employee: Object
})

const employeeToUpdate = ref({
  id: props.employee?.id,
  firstName: props.employee?.firstName,
  lastName: props.employee?.lastName,
  email: props.employee?.email,
  password: props.employee?.password,
  isManager: props.employee?.isManager,
  maxHours: props.employee?.maxHours
});

const emits = defineEmits(['submit'])

function handleClick() {
  updateEmployee()
  emits('submit', 'Edits are complete')
}

function handleDelete() {
  deleteEmployee()
  emits('submit', 'Employee has been deleted')
}

async function deleteEmployee() {
  try {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'MANAGER_KEY'
      },
      redirect: 'follow'
    }
    await fetch(`/api/employees/${employeeToUpdate.value.id}`, options)
  } catch (e) {
    console.error(e)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'There was an error that has occurred during the update process. Please try again.',
      life: 3000
    })
  }
}

async function updateEmployee() {
  try {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'MANAGER_KEY'
      },
      body: JSON.stringify(employeeToUpdate.value),
      redirect: 'follow'
    }
    await fetch(`/api/employees/${employeeToUpdate.value.id}`, options)
  } catch (e) {
    console.error(e)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'There was an error that has occurred during the update process. Please try again.',
      life: 3000
    })
  }
}
</script>

<template>
  <form>

    <div class="form-row">
      <FloatLabel>
        <InputText id="firstname" v-model="employeeToUpdate.firstName" />
        <label for="firstname">First Name</label>
      </FloatLabel>
    </div>
    <div class="form-row">
      <FloatLabel>
        <InputText id="lastname" v-model="employeeToUpdate.lastName" />
        <label for="lastname">Last Name</label>
      </FloatLabel>
    </div>
    <div class="form-row">
      <FloatLabel>
        <InputText id="email" v-model="employeeToUpdate.email" />
        <label for="email">Email</label>
      </FloatLabel>
    </div>
    <div class="form-row">
      <FloatLabel>
        <Password id="password" v-model="employeeToUpdate.password" :feedback="false" />
        <label for="password">Password</label>
      </FloatLabel>
    </div>
    <div class="form-row">
      <label for="manager">Manager</label>
      <ToggleButton id="manager" v-model="employeeToUpdate.isManager" />
    </div>
    <div class="form-row">
      <FloatLabel>
        <InputNumber id="maxHours" v-model="employeeToUpdate.maxHours" show-buttons />
        <label for="maxHours">Max Hours</label>
        <Toast />
      </FloatLabel>
    </div>
    <Button label="Submit Edits" type="button" @click="handleClick" />
    <Button label="Delete Employee" type="button" @click="handleDelete" />
  </form>
</template>

<style scoped>
.form-row {
  margin: 25px;
}
</style>