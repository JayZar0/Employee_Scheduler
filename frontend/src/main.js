import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import './style.css'

import App from './App.vue'
import ScheduleView from "./components/ScheduleView.vue";
import employeeView from "./components/EmployeeView.vue";

const pinia = createPinia()

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
app.use(pinia)
app.mount('#app')