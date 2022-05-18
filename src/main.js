import axios from 'axios'
import 'sweetalert2/dist/sweetalert2.min.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import VueSweetalert2 from 'vue-sweetalert2'
import App from './App.vue'
import { routes } from './routes'
import Store from './store/store'
axios.defaults.baseURL = 'http://127.0.0.1:8000/api/';
const history=createWebHistory();
const router=createRouter({
    history,
    routes: routes,
});
createApp(App).use(router).use(Store).use(VueSweetalert2).mount("#app");

axios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (error.response.status == 401) {
          //dont forget to call the server api to logout user
          router.push({name: "login"});
      }
  
      return Promise.reject(error);
    }
  );
