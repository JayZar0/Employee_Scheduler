<script setup>
/*
    This component is used for logging in with an email address and password
 */

import { ref } from 'vue';
import { zodResolver } from '@primeuix/forms/resolvers/zod';
import { useToast } from "primevue/usetoast";
import { z } from 'zod';
import Password from 'primevue/password';
import Form from '@primevue/forms/form';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InvalidPasswordView from './InvalidPassword.vue'
import InvalidEmailView from './InvalidEmailView.vue'

const toast = useToast();
const initialValues = ref({
  password: '',
  email: ''
});

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

const onFormSubmit = ({ valid }) => {
 console.log("Login submitted");

  // look up email in DB and show invalid email modal if it doesn't exist

  //TODO: check the password against the stored password for the person with that email

 // Check password against a hardcoded password for now
  // if invalid - show invalid modal

  //TODO: check password against a plaintext password for the user in the database



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
  <InvalidPasswordView/>

  <InvalidEmailView/>

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
