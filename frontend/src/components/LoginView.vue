<script setup>
import { ref } from 'vue';
import { zodResolver } from '@primeuix/forms/resolvers/zod';
import { useToast } from "primevue/usetoast";
import { z } from 'zod';
import Password from 'primevue/password';
import Form from '@primevue/forms/form';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

const toast = useToast();
const initialValues = ref({
  password: '',
  email: ''
});

// Define separate validation for email and password
const emailValidation = z.string().min(1, { message: 'Email is required' }).email({ message: 'Please enter a valid email' });
const passwordValidation = z.string().min(1, { message: 'Password is required' });

// Define the resolver correctly for the form
const resolver = ref(zodResolver(
    z.object({
      email: emailValidation,
      password: passwordValidation
    })
));

const onFormSubmit = ({ valid }) => {
  if (valid) {
    toast.add({ severity: 'success', summary: 'Form is submitted.', life: 3000 });
  }
};
</script>

<template>
  <h2>Login</h2>
  <Form v-slot="$form" :resolver="resolver" :initialValues="initialValues" @submit="onFormSubmit" class="flex flex-col gap-4 w-full sm:w-64 items-center">
    <div class="flex flex-col gap-1">
      <div class="input-container">
        <InputText name="email" class="text-input" type="text" v-model="value" placeholder="Email"/>
        <template v-if="$form.email?.invalid">
          <Message :key="index" severity="error" size="small" variant="simple" class="error-message">{{ $form.email.errors[0].message }}</Message>
        </template>
        <Password name="password" placeholder="Password" :feedback="false" fluid toggle-mask/>
        <template v-if="$form.password?.invalid">
          <Message v-for="(error, index) in $form.password.errors" :key="index" severity="error" size="small" variant="simple" class="error-message">{{ error.message }}</Message>
        </template>
      </div>

    </div>
    <Button type="submit" severity="primary" label="Submit" />
  </Form>
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
