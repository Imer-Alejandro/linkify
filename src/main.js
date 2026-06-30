import './assets/main.css'
import localforage from 'localforage';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vue3Toastify from 'vue3-toastify'

localforage.config({
    driver: localforage.INDEXEDDB,
    name: 'mi_app_vue3',
    version: 1.0,
    storeName: 'mi_store',
    description: 'Almacenamiento en IndexedDB para mi aplicación Vue 3'
  })

const app = createApp(App)

app.use(router)
app.use(Vue3Toastify, {
  position: 'bottom-right',
  autoClose: 2500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  newestOnTop: true,
  theme: 'dark',
})

app.mount('#app')
