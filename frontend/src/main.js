import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import { createMemoryHistory, createRouter } from 'vue-router'
import './style.css'

import App from './App.vue'
import ScheduleView from "./components/ScheduleView.vue";
import employeeView from "./components/EmployeeView.vue";

const routes = [
    { path: '/', component: ScheduleView },
    { path: '/employees', component: employeeView}
]

const router = createRouter({
    history: createMemoryHistory(),
    routes
})

const app = createApp(App)

app.use(router)
app.use(PrimeVue)
app.mount('#app')