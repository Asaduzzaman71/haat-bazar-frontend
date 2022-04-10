import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import {routes} from './routes'
import Store  from './store/store'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import Axios from 'axios'

Axios.defaults.baseURL = 'http://127.0.0.1:80/api/';

const history=createWebHistory();
const router=createRouter({
    history,
    routes: routes,
});
createApp(App).use(router).use(Store).use(VueSweetalert2).mount("#app");


