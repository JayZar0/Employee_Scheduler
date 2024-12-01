
<script setup>
  import { RouterLink } from "vue-router";
  import { ref } from "vue";

  const items = ref([
    { route: '/schedule', label: 'Schedule' },
    { route: '/employees', label: 'Manage Employees' }
  ]);

</script>

<template>
  <div class="card">
    <Tabs value="/dashboard">
      <TabList>
        <Tab v-for="tab in items" :key="tab.label" :value="tab.route">
          <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
            <a v-ripple :href="href" @click="navigate" class="flex items-center gap-2 text-inherit">
              <i :class="tab.icon" />
              <span>{{ tab.label }}</span>
            </a>
          </router-link>
        </Tab>
      </TabList>
    </Tabs>
  </div>
</template>

<style>

TabList {
  display: flex;
  justify-content: space-evenly;
}

Tab a {
  color: black;
}

</style>

