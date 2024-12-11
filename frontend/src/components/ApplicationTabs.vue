
<script setup>
  import { RouterLink } from "vue-router";
  import { ref } from "vue";
  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';




  const items = ref([
    { route: '/managers', label: 'Home' }, //taking this out because the menu bar removes the need for it
    { route: '/schedule', label: 'Schedule' },
    { route: '/employees', label: 'Manage Employees' }
  ]);

</script>

<template>
  <div class="card">
    <Tabs value="/dashboard">
      <TabList>
        <router-link v-for="tab in items" :key="tab.label" :to="tab.route">
          <Tab :value="tab.route">
<!--            <a v-ripple :href="href" @click="navigate" class="flex items-center gap-2 text-inherit">-->
              <i :class="tab.icon" />
              <span class="navText">{{ tab.label }}</span>
<!--            </a>-->
          </Tab>
        </router-link>
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
  font-size: 1.1em;
}

.navText {
  color: green;
}

</style>

