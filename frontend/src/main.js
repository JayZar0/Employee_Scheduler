import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Aura from '@primevue/themes/aura'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import 'primeicons/primeicons.css';
import './style.css'
import store from './stores/store.js';

import App from './App.vue'
import ScheduleView from "./components/ScheduleView.vue";
import employeeView from "./components/EmployeeView.vue";
import LoginView from "./components/LoginView.vue";
import ManagerView from "./components/ManagerView.vue";

const pinia = createPinia()

const routes = [
    { path: '/', component: LoginView },
    { path: '/employees', component: employeeView },
    { path: '/managers', component: ManagerView },
    { path: '/schedule', component: ScheduleView }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes
})

const app = createApp(App)

app.use(router).use(store);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
})
app.use(ToastService)
app.use(pinia)
app.mount('#app')
