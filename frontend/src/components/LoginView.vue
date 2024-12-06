<script setup>
import { ref, defineEmits } from 'vue';
import { zodResolver } from '@primeuix/forms/resolvers/zod';
import { z } from 'zod';
import Password from 'primevue/password';
import Form from '@primevue/forms/form';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InvalidEmailPopup from "./InvalidCredentialsPopup.vue";
import { useRouter } from 'vue-router';
import { useStore } from "vuex";

/*
    This component is used for logging in with an email address and password
 */

// ref variables
const email = ref(''); // bound to entered email
const password = ref(''); // bound to entered password
const invalidCredentialsPopupVisible = ref(false); // toggles on and off the invalid email pop up
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
 * Searches the DB for a user with the email provided in the login screen
 * @param email the email address that the user is trying to log in with
 * @param password the password that the employee is trying to log in with
 * @returns the guid to be used as the bearerToken and the users level of access
 */
async function login(email, password) {

  const loginRes = await fetch(`/api/`,
      {
        method: 'POST', // more secure than GET
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body : JSON.stringify({email, password}) // send the email and password to the backend
      });
  if (!loginRes.ok) {
    throw new Error('login failed');
  }
  return loginRes.json();
}


/**
 * Helper function determines where the user should go after login
 */
function redirect() {
  if (store.state.isManager) {
    router.push('/managers'); // mgr splash screen
  } else {
    router.push('/schedule'); // emps go directly to schedule
  }
}

/**
 * Method for checking if the email and password match an employee in the DB
 * when someone tries to log in
 */

async function authenticate() {

  try {
    const userAccessCredentials = await login(email.value, password.value); // send the username and password to BE, get back bearerToken and access level
    await store.dispatch('login', userAccessCredentials); // set the global state with appropriate access
    redirect();  // redirect based on the level of access
  } catch (e) { // most likely a 403 for incorrect credentials
      invalidCredentialsPopupVisible.value = true;
  }
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

  <!--Shown if invalid credentials are entered -->
  <InvalidEmailPopup v-model:visible="invalidCredentialsPopupVisible" :email="email"/>

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
