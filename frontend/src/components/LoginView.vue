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
  password: ''
});
const resolver = ref(zodResolver(
    z.object({
      password: z
          .string()
          .min(1, { message: 'Password is required' })
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
      <InputText type="text" v-model="value" />
      <div class="password-container">
        <Password name="password" placeholder="Password" :feedback="false" fluid toggle-mask/>
      </div>
      <template v-if="$form.password?.invalid">
        <Message v-for="(error, index) in $form.password.errors" :key="index" severity="error" size="small" variant="simple" class="error-message">{{ error.message }}</Message>
      </template>
    </div>
    <Button type="submit" severity="secondary" label="Submit" />
  </Form>
</template>

<style>
.password-container {
  width: 200px; /* Adjust the width as needed */
  display: flex;
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
</style>
