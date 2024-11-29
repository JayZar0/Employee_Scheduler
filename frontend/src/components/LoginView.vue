<script setup>

/*
    This component is used for logging in with an email address and password
 */

import { ref, defineEmits } from 'vue';
import { zodResolver } from '@primeuix/forms/resolvers/zod';
import { z } from 'zod';
import Password from 'primevue/password';
import Form from '@primevue/forms/form';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InvalidPasswordView from './InvalidPassword.vue'
import InvalidEmailView from './InvalidEmailView.vue'

const email = ref(''); // bound to entered email
const password = ref(''); // bound to entered password
const invalidPasswordVisible = ref(false); // toggles on and off the invalid password dialog
const invalidEmailVisible = ref(false); // toggles on and off the invalid email dialog

// define the email which we will emit to other components
const emit = defineEmits(['emitEmail']);

function emitEmail() {
  emit('emitEmail', email.value);
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
 * Given a valid, existing, email we check that the password matches what is stored in the DB
 * @param emp the employee that they are trying to log in as (corresponds to the entered email)
 */
function validatePassword(emp) {
  // check the entered password against the stored password for this email
  return password.value === emp.password;
}

/**
 * Searches the DB for a user with the email provided in the login screen
 * @param email the email address that the user is trying to log in with
 * @returns {Promise<void>}
 */
function getEmployeeByEmail(email) {

  // define options object for getting the employees
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `MANAGER_KEY` //TODO: change this ??
    }
  }

  // Let's search for the employee in the database given the email entered
  return fetch(`api/employees?search=${email}`, options)
      .then(response => response.json())
      // emp will be in an array, pull out emp object or return null if none is found
      .then(empsFromDB => empsFromDB[0] ? empsFromDB[0] : null);
}

/**
 * Method for checking if the email and password match an employee in the DB
 */
function authenticate() {
  // try to look up the employee, this will be async
  const matchedEmp = getEmployeeByEmail(email.value) // this uses the email ref
      .then(matchedEmp => {
        // let's see if there is an employee with that email
        if (matchedEmp) {
          if (validatePassword(matchedEmp)) {
            // redirect if password matches
            // TODO: redirect
          }
          // show password error dialog if password is wrong
          else {
            invalidPasswordVisible.value = true;
          }
        }
        // if no emp is found with that email show appropriate error dialog
        else {
          invalidEmailVisible.value = true;
          //TODO: WE NEED TO PASS email TO THIS COMPONENT
        }
      });
}

/**
 * On submit authenticates the user trying to login
 */
const onFormSubmit = () => {
  emitEmail(); // send the email to the dialog components so they can use it in their messages
  authenticate(); // look up the users credentials, give appropriate bearer token or alert them of error
};

</script>


<template>
  <!-- Login form using email and password -->
  <h2>Login</h2>

  <Form v-slot="$form" :resolver="resolver" :initialValues="initialValues" @submit="onFormSubmit" class="flex flex-col gap-4 w-full sm:w-64 items-center">
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
    <Button type="submit" severity="primary" label="Submit" />
  </Form>

  <!--Shown if an invalid password is entered -->
  <InvalidPasswordView v-model:visible="invalidPasswordVisible"/>

  <!--Shown if an email that doesn't correspond to an employee is entered-->
  <InvalidEmailView v-model:visible="invalidEmailVisible"/>
</template>


<style>
.input-container {
  width: 200px; /* Adjust the width as needed */
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
  color: #e45555; /* Set the error message text color to red */
  margin-bottom: 10px;
}

.text-input {
  margin-bottom: 10px;
}
</style>