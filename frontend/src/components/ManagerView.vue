<script setup>

import { ref, onMounted } from "vue";
import Button from 'primevue/button';
import { useRouter } from 'vue-router';

const router = useRouter();
const emp = ref('');

/**
 * Retrieves an employee from the DB given their bearer token
 * @returns {Promise<* | null>}
 */
function getEmployeeByToken() {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `MANAGER_KEY` //TODO: change this ??
    }
  }

  // search for the employee in the database given the token
  return fetch(`api/employees?search=${ localStorage.getItem('bearerToken') }`, options)
      .then(response => response.json())
      .then(empsFromDB => empsFromDB[0] ? empsFromDB[0] : null);
}

/**
 * Saves the emp to a ref
 */
onMounted( () => {
  getEmployeeByToken().then(matchedEmp => {
    console.log(matchedEmp.email);
    emp.value = matchedEmp;
  })

});

/**
 * Redirects to the schedule page
 */
function redirectSchedule() {
  router.push('/schedule');
}

/**
 * Redirects to the employee CRUD page
 */
function redirectEmpCRUD() {
  router.push('/employees');
}

</script>

<template>
  <h2>Welcome <span>{{ emp.firstName }} {{ emp.lastName }}</span></h2>

  <div class="flexcolumn">
    <Button class="btn" severity="contrast" @click="redirectSchedule">Shift Scheduler</Button>
    <Button class="btn" severity="contrast" @click="redirectEmpCRUD">Manage Employees</Button>
  </div>

</template>

<style scoped>

.flexcolumn{
  display: flex;
  flex-direction: column;
  width: 200px;
  margin-right: auto;
  margin-left: auto;
}

.btn {
  margin: 10px;
}

span {
  font-family: 'Segoe Print';
  color: cornflowerblue;
}

</style>
