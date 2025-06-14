<script setup>
import { ref, defineEmits, defineProps } from 'vue'
import Button from 'primevue/button'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue'
import InputNumber from 'primevue/inputnumber'

const toast = useToast()

const props = defineProps({
  department: Object,
  edit: Boolean
})

const emp = ref(props.edit? props.department?.id: null)

const departmentToUpdate = ref({
  name: props.edit ? props.department?.name: '',
  wage: props.edit ? props.department?.wage: 0,
});

const disableButton = ref(emp.value === localStorage.getItem('bearerToken'))

const emits = defineEmits(['submit'])

async function handleClick() {
  if (props.edit) {
    await updateDepartment()
  } else {
    await createDepartment()
  }

  emits('submit', 'Edits are complete')
}

async function handleDelete() {
  await deleteDepartment()
  emits('submit', 'Department has been deleted')
}

async function deleteDepartment() {
  try {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('bearerToken')
      },
      redirect: 'follow'
    }
    await fetch(`/api/departments/${emp.value}`, options)
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

async function createDepartment() {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('bearerToken')
      },
      body: JSON.stringify(departmentToUpdate.value),
      redirect: 'follow'
    }
    await fetch(`/api/departments`, options)
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

async function updateDepartment() {
  try {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('bearerToken')
      },
      body: JSON.stringify(departmentToUpdate.value),
      redirect: 'follow'
    }
    await fetch(`/api/departments/${emp.value}`, options)
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
        <InputText id="name" v-model="departmentToUpdate.name" />
        <label for="name">Department Name</label>
      </FloatLabel>
    </div>
    <div class="form-row">
      <FloatLabel>
        <InputNumber id="wage" v-model="departmentToUpdate.wage" />
        <label for="wage">Wage</label>
      </FloatLabel>
    </div>
    <Button label="Submit" type="button" @click="handleClick" :style="{
      'margin': '20px'
    }" />
    <Button v-if="edit && !disableButton" label="Delete Position" type="button" @click="handleDelete" />
  </form>
</template>

<style scoped>
.form-row {
  margin: 25px;
}
</style>