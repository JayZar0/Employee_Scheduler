<script setup>
import FloatLabel from 'primevue/floatlabel'
import InputNumber from 'primevue/inputnumber'
import Listbox from 'primevue/listbox'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'

</script>

<template>
  <form action="/api/shifts">
    <Listbox />

    <Listbox />

    <FloatLabel variant="on">
      <DatePicker id="date" />
      <label for="date">Date</label>
    </FloatLabel>

    <FloatLabel variant="on">
      <InputNumber id="startTime" :min="1" :max="24" showButtons buttonLayout="horizontal" />
      <label for="startTime">Start</label>
    </FloatLabel>

    <FloatLabel variant="on">
      <InputNumber id="endTime" :min="1" :max="24" showButtons buttonLayout="horizontal" />
      <label for="endTime">End</label>
    </FloatLabel>

    <Button label="submit" type="submit" />
  </form>
</template>

<style scoped>

</style>