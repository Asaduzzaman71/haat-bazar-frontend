import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import {routes} from './routes'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const history=createWebHistory();
const router=createRouter({
    history,
    routes: routes
});
createApp(App).use(router).use(VueSweetalert2).mount("#app");


