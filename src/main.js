import './assets/main.css'
import localforage from 'localforage';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


// Configuración de LocalForage para usar IndexedDB
localforage.config({
    driver: localforage.INDEXEDDB,
    name: 'mi_app_vue3',
    version: 1.0,
    storeName: 'mi_store',
    description: 'Almacenamiento en IndexedDB para mi aplicación Vue 3'
  })

const app = createApp(App)

app.use(router)

app.mount('#app')
