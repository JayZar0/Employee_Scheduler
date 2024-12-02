<script setup>
import { ref, defineEmits } from 'vue';
import { zodResolver } from '@primeuix/forms/resolvers/zod';
import { z } from 'zod';
import Password from 'primevue/password';
import Form from '@primevue/forms/form';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InvalidPasswordPopup from "./InvalidPasswordPopup.vue";
import InvalidEmailPopup from "./InvalidEmailPopup.vue";
import { useRouter } from 'vue-router';
import { useStore } from "vuex";

/*
    This component is used for logging in with an email address and password
 */

// ref variables
const email = ref(''); // bound to entered email
const password = ref(''); // bound to entered password
const invalidPasswordVisible = ref(false); // toggles on and off the invalid password pop up
const invalidEmailVisible = ref(false); // toggles on and off the invalid email pop up
const router = useRouter(); // used for redirect
const store = useStore(); // global state

// email address will be emitted to pop up components
const emit = defineEmits(['emitEmail']);
function emitEmail() {
  emit('emitEmail',
      { email : email.value });
}

// Validation in the UI for the email & password
const emailValidation = z
                        .string()
                        .min(1, { message: 'Email is required' })
                        .email({ message: 'Please enter a valid email' });

const passwordValidation = z
                          .string()
                          .min(1, { message: 'Password is required' });


// Resolver for checking form objects
const resolver = ref(zodResolver(
    z.object({
      email: emailValidation,
      password: passwordValidation
    })
));

/**
 * Given a valid, existing, email we check that the password matches what is stored for that user in the DB
 * @param emp the employee that they are trying to log in as
 */
function validatePassword(emp) {
  return password.value === emp.password;
}

/**
 * Searches the DB for a user with the email provided in the login screen
 * @param email the email address that the user is trying to log in with
 * @returns {Promise<void>}
 */
function getEmployeeByEmail(email) {
  // req options
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `MANAGER_3061daf3-1f24-49f7-a1ea-aedcfa6e415e` // we can't get emps unless you do it as a manager
      // don't delete chris tran, or you will break the app thanks
    }
  }
  // return res to method caller
  return fetch(`api/employees?search=${email}`, options)
      .then(response => response.json())
      .then(empsFromDB => empsFromDB[0] ? empsFromDB[0] : null); // emp will be wrapped in array
}

/**
 * Helper function determines where the user should go after login
 */
function redirect() {
  if (store.state.isManager) {
    router.push('/schedule'); // could take managers to /managers instead but it seems redundant
  } else {
    router.push('/schedule'); // emps go directly to schedule
  }
}

/**
 * Method for checking if the email and password match an employee in the DB
 * when someone tries to log in
 */
function authenticate() {
  getEmployeeByEmail(email.value) // look up an emp in the DB with the entered email
      .then(matchedEmp => {
        if (matchedEmp) {
          if (validatePassword(matchedEmp)) {
            store.dispatch('login', matchedEmp); // login globally
            localStorage.setItem('bearerToken', matchedEmp.bearerToken); // assign bearer token
            redirect(); // will redirect according to level of access
          }
          else { // show password error dialog if password is wrong
            emitEmail();
            invalidPasswordVisible.value = true;
          }
        } else { // if no emp is found with that email show appropriate error dialog
          emitEmail();
          invalidEmailVisible.value = true;
        }
      });
}
</script>

<template>

  <div>
    <h3>Login</h3>
    <!-- Login form using email and password -->
    <Form v-slot="$form" :resolver="resolver" @submit="authenticate" class="flex flex-col gap-4 w-full sm:w-64 items-center">
      <div class="flex flex-col gap-1">
        <div class="input-container">

          <!-- Email input -->
          <InputText name="email" class="text-input" type="text" v-model="email" placeholder="Email"/>
          <template v-if="$form.email?.invalid">
            <Message :key="index" severity="error" size="small" variant="simple" class="error-message">{{ $form.email.errors[0].message }}</Message>
          </template>

          <!-- Password input -->
          <Password name="password" placeholder="Password" :feedback="false" v-model="password" fluid toggle-mask/>
          <template v-if="$form.password?.invalid">
            <Message v-for="(error, index) in $form.password.errors" :key="index" severity="error" size="small" variant="simple" class="error-message">{{ error.message }}</Message>
          </template>
        </div>
      </div>
      <!-- Submit button triggers authentication -->
      <Button type="submit" severity="info" label="Submit" />
    </Form>
  </div>

  <!--Shown if an invalid password is entered -->
  <InvalidPasswordPopup v-model:visible="invalidPasswordVisible" :email="email"/>

  <!--Shown if an email that doesn't correspond to an employee is entered-->
  <InvalidEmailPopup v-model:visible="invalidEmailVisible" :email="email"/>

</template>

<style scoped>
.input-container {
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 10px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.error-message {
  color: #e45555;
  margin-bottom: 10px;
}

.text-input {
  margin-bottom: 10px;
}
</style>
