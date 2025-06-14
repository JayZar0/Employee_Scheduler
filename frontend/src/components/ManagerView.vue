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
async function getEmployeeByToken() {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: localStorage.getItem('bearerToken')
    }
  };

  const response = await fetch(`api/employees/${localStorage.getItem('bearerToken')}`, options);
  const data = await response.json();
  return data || "no user found";
}

/**
 * Saves the emp to a ref
 */
onMounted( async () => {
  const matchedEmp = await getEmployeeByToken();
  emp.value = matchedEmp;
  console.log(matchedEmp);
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

function redirectDepCRUD() {
  router.push('/departments')
}

</script>

<template>
  <div>
    <h2>Welcome <span>{{ emp.firstName }} {{ emp.lastName }}</span></h2>

    <div class="flexcolumn">
      <Button class="btn" severity="contrast" @click="redirectSchedule">Shift Scheduler</Button>
      <Button class="btn" severity="contrast" @click="redirectEmpCRUD">Manage Employees</Button>
      <Button class="btn" severity="contrast" @click="redirectDepCRUD">Manage Departments</Button>
    </div>
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
  color: #479724;
}

</style>
