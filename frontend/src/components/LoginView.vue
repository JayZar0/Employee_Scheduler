<script setup>

/*
    This component is used for logging in with an email address and password
 */

import { ref } from 'vue';
import { zodResolver } from '@primeuix/forms/resolvers/zod';
import { z } from 'zod';
import Password from 'primevue/password';
import Form from '@primevue/forms/form';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InvalidPasswordView from './InvalidPassword.vue'
import InvalidEmailView from './InvalidEmailView.vue'

// validation for the email & password
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

// Visible properties for the error messages
const invalidPasswordVisible = ref(false);
const invalidEmailVisible = ref(false);

/**
 * Searches for an employee in the database based on their email address
 * @param email - the email address entered in the form
 * @returns {Promise<void>}
 */
function validateEmail(email) {
  let validEmail = false;

  //TODO: Implement, make valid to true


  return validEmail;
}

/**
 * Given a valid, existing email we check that the password matches what is stored in the DB
 * @param email the email of the user logging in
 * @param password the password the user is trying to login with
 */
function validatePassword(email, password) {
  let validPassword = false;

  //TODO: Implement, change valid to true

  return validPassword;
}

/**
 * Searches the DB for a user with the email provided in the login screen
 * @returns {Promise<void>}
 */
async function getEmployeeByEmail() {

  // define options object for getting the employees
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `MANAGER_KEY`
    }
  }

  // TODO: email should come from entered email

  const empPromise = await fetch(`api/employees`, options);

  //const empPromise = await fetch(`api/employees?search=${email}`, options);
  const empsFromDB = await empPromise.json();
  console.log(empsFromDB);

  //TODO: check if an employee is returned
}

/**
 * Method for checking if the email and password match an employee in the DB
 */
function authenticate() {

  // try to look up the employee
  const matchedEmp = getEmployeeByEmail();

  // try to GET the user based on their email
  if (!validateEmail(matchedEmp.email)) {
    // show the error modal if the email is not associated with a stored employee
    invalidEmailVisible.value = true;
  }

  else {
    // valid email, let's check the password
    if (!validatePassword(matchedEmp.email, matchedEmp.password)) {
      // display error modal if the password does not match the email
      invalidPasswordVisible.value = true;
    }
  }
}
// on submit function validates the user and provides them with their bearer token
const onFormSubmit = ({ valid }) => {
 console.log("Login submitted");
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
        <InputText name="email" class="text-input" type="text" v-model="value" placeholder="Email"/>
        <template v-if="$form.email?.invalid">
          <Message :key="index" severity="error" size="small" variant="simple" class="error-message">{{ $form.email.errors[0].message }}</Message>
        </template>

        <!-- Password input -->
        <Password name="password" placeholder="Password" :feedback="false" fluid toggle-mask/>
        <template v-if="$form.password?.invalid">
          <Message v-for="(error, index) in $form.password.errors" :key="index" severity="error" size="small" variant="simple" class="error-message">{{ error.message }}</Message>
        </template>
      </div>

    </div>
    <Button type="submit" severity="primary" label="Submit" />
  </Form>

  <!--Shown if an invalid password is entered -->
  <InvalidPasswordView v-model:visible="invalidPasswordVisible"/>

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
