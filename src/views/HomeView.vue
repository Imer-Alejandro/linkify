<script>
import registrar_enlaces from "@/components/registar_enlace.vue"
import registrar_categoria from "@/components/registrar_categoria.vue"
import eliminar_categoria from "@/components/eliminar_categoria.vue"
import eliminar_enlaces from "@/components/eliminar_enlaces.vue"
import detalles_enlace from "@/components/detalles_enlace.vue"
import editar_enlace from "@/components/editar_enlace.vue"
import busqueda_enlace from "@/components/busqueda_enlace.vue"
import card_enlace from "@/components/card_enlace.vue"
import import_excel from "@/components/import_excel.vue"
import export_excel from "@/components/export_excel.vue"

import { emitter } from '@/eventBus';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import localforage from 'localforage'

export default {
  mounted(){
    this.obtener_categoria();
    this.obtener_enlaces();
    this.verificarRecordatorios();
    this.actualizarEstadoNotificaciones();
    this.reminderCheckInterval = window.setInterval(() => {
      this.verificarRecordatorios()
    }, 30000)

    emitter.on('abrir_eliminar_enlace',(data)=>{
      this.mostrarEliminarEnlace=true
      this.datos_enlace_acion= data
    })
    emitter.on('cerrar_eliminar_enlace',()=>{
      this.mostrarEliminarEnlace=false;
      this.obtener_enlaces()
      this.mostrarDetalleEnlace = false;
    })
    emitter.on('abrir_editar_enlace',(data)=>{
        this.mostrarEditarEnlace=true
        this.datos_enlace_acion= data
    })
    emitter.on('cerrar_editar_enlaces',()=>{
      this.obtener_enlaces()
      this.mostrarEditarEnlace=false
      this.mostrarDetalleEnlace = false;
    })
    emitter.on('cerrar_registro_enlace',()=>{
      this.obtener_enlaces()
      this.mostrarRegistrarEnlace=false
    })
    emitter.on('cerrar_registro_categoria',()=>{
      localforage.getItem('token_categoria')
      .then((listado)=>{
        this.categorias=JSON.parse(listado)
      })
      .catch((err)=>{
        console.error(err)
      })
      this.mostrarRegistrarCategoria=false
    })
    emitter.on('abrir_eliminar_categoria',(indice)=>{
      this.id_categoria=indice;
      this.mostrarEliminarCategoria=true
    })
    emitter.on('cerrar_eliminar_categoria',()=>{
      localforage.getItem('token_categoria')
      .then((listado)=>{
        this.categorias=JSON.parse(listado)
      })
      .catch((err)=>{
        console.error(err)
      })
      this.filtar_elementos = '- todos'
      this.mostrarEliminarCategoria=false
    })
    emitter.on('cerrar_busqueda_enlace',()=>{
      this.mostrarBusquedaEnlace=false
      this.data_busqueda=''
    })
    emitter.on('cerrar_detalles_enlace',()=>{
      this.mostrarDetalleEnlace = false;
    })
    emitter.on('abrir_detalles_enlace',(data)=>{
      this.mostrarDetalleEnlace = true
      this.datos_enlace_acion= data
    })
    emitter.on('toggle_favorito_enlace', (data) => {
      this.toggleFavorito(data)
    })
  },
  beforeUnmount(){
    this.scheduledReminderTimers.forEach(timerId => clearTimeout(timerId))
    if (this.reminderCheckInterval) {
      window.clearInterval(this.reminderCheckInterval)
    }
  },
  components:{
    "registrar-enlace":registrar_enlaces,
    "registrar-categoria":registrar_categoria,
    "eliminar-categoria":eliminar_categoria,
    "eliminar-enlace":eliminar_enlaces,
    "detalle-enlace":detalles_enlace,
    "editar-enlace":editar_enlace,
    "buscar-enlace":busqueda_enlace,
    "enlaces":card_enlace,
    "import-excel":import_excel,
    "export-excel":export_excel
  },
  data(){
    return{
      loading: true,
      datos_enlace_acion:'',
      id_categoria:'',
      enlaces:[],
      categorias:[],
      data_busqueda:'',
      indicador_categoria:'',
      filtar_elementos:'',
      sortOption: 'fecha',
      mostrarRegistrarEnlace:false,
      mostrarRegistrarCategoria:false,
      mostrarDetalleEnlace:false,
      mostrarEditarEnlace:false,
      mostrarBusquedaEnlace:false,
      mostrarCompartirEnlace:false,
      mostrarEliminarCategoria:false,
      mostrarEliminarEnlace:false,
      mostrarImportExcel:false,
      mostrarExportExcel:false,
      upcomingReminders:[],
      scheduledReminderTimers:[],
      reminderCheckInterval:null,
      notificationPermission:'default',
      notificationPermissionMessage:''
    }
  },
  computed:{
    stats(){
      return {
        totalEnlaces: this.enlaces.length,
        categoriasCount: this.categorias.length,
        recordatoriosCount: this.upcomingReminders.length
      }
    }
  },
  watch:{
    filtar_elementos(){
      this.aplicarFiltros()
    },
    sortOption(){
      this.aplicarFiltros()
    }
  },
  methods:{
    aplicarFiltros(){
      localforage.getItem("token_enlace")
      .then(listado => {
        let items = listado ? JSON.parse(listado) : []
        if (this.filtar_elementos && this.filtar_elementos !== '- todos' && this.filtar_elementos !== '- favoritos') {
          items = items.filter(e => e.categoria === this.filtar_elementos)
        } else if (this.filtar_elementos === '- favoritos') {
          items = items.filter(e => e.favorito)
        }
        if (this.sortOption === 'nombre') {
          items.sort((a, b) => a.nombre.localeCompare(b.nombre))
        } else if (this.sortOption === 'nombre_desc') {
          items.sort((a, b) => b.nombre.localeCompare(a.nombre))
        } else if (this.sortOption === 'categoria') {
          items.sort((a, b) => (a.categoria || '').localeCompare(b.categoria || ''))
        } else {
          items.sort((a, b) => (b.fecha_creacion || 0) - (a.fecha_creacion || 0))
        }
        this.enlaces = items
        this.loading = false
        this.indicador_categoria = `- ${this.filtar_elementos === '- favoritos' ? 'favoritos' : this.filtar_elementos}`
      })
      .catch(err => console.error(err))
    },
    abrir_registro_enlaces(){
      this.mostrarRegistrarEnlace = true;
    },
    abrir_registro_categoria(){
      this.mostrarRegistrarCategoria = true;
    },
    abrir_eliminar_categoria(indice){
      emitter.emit('abrir_eliminar_categoria', indice);
    },
    buscar_enlace(){
      this.mostrarBusquedaEnlace=true
    },
    obtener_categoria(){
      localforage.getItem('token_categoria')
      .then(datos=>{
        this.indicador_categoria=" - todos"
        this.categorias=datos ? JSON.parse(datos) : []
      })
      .catch(err=>{
        console.error(err)
      })
    },
    obtener_enlaces(){
      this.aplicarFiltros()
      this.verificarRecordatorios()
    },
    toggleFavorito(data) {
      localforage.getItem('token_enlace')
      .then(listado => {
        if (!listado) return
        let enlaces = JSON.parse(listado)
        const idx = enlaces.findIndex(e =>
          e.enlace_url === data.enlace_url && e.nombre === data.nombre
        )
        if (idx !== -1) {
          enlaces[idx].favorito = !enlaces[idx].favorito
          const localIdx = this.enlaces.findIndex(e =>
            e.enlace_url === data.enlace_url && e.nombre === data.nombre
          )
          if (localIdx !== -1) {
            this.enlaces[localIdx].favorito = enlaces[idx].favorito
          }
          this.datos_enlace_acion = { ...this.datos_enlace_acion }
          return localforage.setItem('token_enlace', JSON.stringify(enlaces))
        }
      })
      .catch(err => console.error(err))
    },
    limpiarTimers(){
      this.scheduledReminderTimers.forEach(timerId => clearTimeout(timerId))
      this.scheduledReminderTimers = []
    },
    actualizarEstadoNotificaciones() {
      if (!('Notification' in window)) {
        this.notificationPermission = 'unsupported'
        this.notificationPermissionMessage = 'Tu navegador no admite notificaciones.'
        return
      }

      this.notificationPermission = Notification.permission
      if (Notification.permission === 'granted') {
        this.notificationPermissionMessage = ''
      } else if (Notification.permission === 'denied') {
        this.notificationPermissionMessage = 'Las notificaciones están bloqueadas. Actívalas desde la configuración del navegador.'
      } else {
        this.notificationPermissionMessage = 'Activa las notificaciones para recibir alertas de tus recordatorios.'
      }
    },
    async solicitarPermisosNotificaciones() {
      if (!('Notification' in window)) {
        this.notificationPermission = 'unsupported'
        this.notificationPermissionMessage = 'Tu navegador no admite notificaciones.'
        toast.error('Tu navegador no admite notificaciones.')
        return
      }

      if (Notification.permission === 'granted') {
        this.notificationPermission = 'granted'
        this.notificationPermissionMessage = ''
        toast.success('Las notificaciones ya están activadas.')
        return
      }

      if (Notification.permission === 'denied') {
        this.notificationPermission = 'denied'
        this.notificationPermissionMessage = 'Las notificaciones están bloqueadas. Actívalas desde la configuración del navegador.'
        toast.warning('Las notificaciones están bloqueadas en este navegador.')
        return
      }

      const permission = await Notification.requestPermission()
      this.notificationPermission = permission
      if (permission === 'granted') {
        this.notificationPermissionMessage = ''
        toast.success('Notificaciones activadas correctamente.')
      } else {
        this.notificationPermissionMessage = 'Las notificaciones están bloqueadas. Actívalas desde la configuración del navegador.'
        toast.error('No se concedieron las notificaciones.')
      }
    },
    async verificarRecordatorios(){
      try {
        const listado = await localforage.getItem('token_enlace')
        const enlaces = listado ? JSON.parse(listado) : []
        const now = Date.now()

        this.limpiarTimers()

        this.upcomingReminders = enlaces
          .filter(item => item.reminder_enabled && item.reminder_at && !item.reminder_notified)
          .filter(item => new Date(item.reminder_at).getTime() > now)
          .sort((a, b) => new Date(a.reminder_at) - new Date(b.reminder_at))
          .slice(0, 3)

        if (navigator.serviceWorker?.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'REMINDERS_SYNC',
            reminders: enlaces
          })
        }

        enlaces.forEach((item) => {
          if (!item.reminder_enabled || !item.reminder_at || item.reminder_notified) return

          const reminderTime = new Date(item.reminder_at).getTime()
          if (reminderTime <= now) {
            this.activarRecordatorio(item)
            return
          }

          const timerId = window.setTimeout(() => {
            this.activarRecordatorio(item)
          }, reminderTime - now)

          this.scheduledReminderTimers.push(timerId)
        })
      } catch (error) {
        console.error(error)
      }
    },
    async activarRecordatorio(item) {
      try {
        const listado = await localforage.getItem('token_enlace')
        if (!listado) return

        const enlaces = JSON.parse(listado)
        const itemIndex = enlaces.findIndex((link) => link.enlace_url === item.enlace_url && link.nombre === item.nombre)
        if (itemIndex === -1) return

        enlaces[itemIndex].reminder_notified = true
        await localforage.setItem('token_enlace', JSON.stringify(enlaces))

        this.mostrarNotificacion(item)
        this.verificarRecordatorios()
      } catch (error) {
        console.error(error)
      }
    },
    async mostrarNotificacion(item) {
      const title = `Recordatorio: ${item.nombre}`
      const body = item.descripcion || 'Es hora de revisar este enlace.'

      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(title, { body, icon: '/red-mundial.png' })
          return
        }

        if (Notification.permission !== 'denied') {
          const permission = await Notification.requestPermission()
          if (permission === 'granted') {
            new Notification(title, { body, icon: '/red-mundial.png' })
            return
          }
        }
      }

      toast.info(`${title} · ${body}`)
    },
    irARecordatorios(){
      this.$router.push('/recordatorios')
    }
  },
}
</script>

<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(30,41,59,0.95),_rgba(2,6,23,1))] pb-32">

    <registrar-enlace v-if="mostrarRegistrarEnlace"/>
    <editar-enlace :datos_enlace="datos_enlace_acion" v-if="mostrarEditarEnlace"/>
    <registrar-categoria v-if="mostrarRegistrarCategoria"/>
    <eliminar-categoria :id_categoria="id_categoria" v-if="mostrarEliminarCategoria"/>
    <eliminar-enlace :datos_enlace="datos_enlace_acion" v-if="mostrarEliminarEnlace"/>
    <buscar-enlace :dato_busqueda="data_busqueda" v-if="mostrarBusquedaEnlace"/>
    <detalle-enlace :datos_enlace="datos_enlace_acion" v-if="mostrarDetalleEnlace"/>
    <import-excel v-if="mostrarImportExcel" @close="mostrarImportExcel=false" @imported="obtener_enlaces()"/>
    <export-excel v-if="mostrarExportExcel" @close="mostrarExportExcel=false"/>

    <!-- Header -->
    <header class="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div class="px-4 pt-4 pb-3">
        <div class="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-4 shadow-lg">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0">
              <p class="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Dashboard</p>
              <h1 class="mt-1 text-lg font-semibold text-white sm:text-xl">Links</h1>
            </div>
            <div class="flex flex-wrap items-center justify-end gap-1 sm:shrink-0">
              <button @click="irARecordatorios" class="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-2 text-xs font-medium text-slate-200">
                Calendario
              </button>
              <button @click="mostrarImportExcel=true" class="btn-ghost text-xs" title="Importar Excel">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                </svg>
              </button>
              <button @click="mostrarExportExcel=true" class="btn-ghost text-xs" title="Exportar Excel">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-3 gap-2">
            <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-2.5 text-center sm:p-3">
              <p class="truncate text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-[10px]">Enlaces</p>
              <p class="mt-1 text-base font-semibold text-white sm:text-lg">{{ stats.totalEnlaces }}</p>
            </div>
            <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-2.5 text-center sm:p-3">
              <p class="truncate text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-[10px]">Categorías</p>
              <p class="mt-1 text-base font-semibold text-white sm:text-lg">{{ stats.categoriasCount }}</p>
            </div>
            <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-2.5 text-center sm:p-3">
              <p class="truncate text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-[10px]">Recordatorios</p>
              <p class="mt-1 text-base font-semibold text-white sm:text-lg">{{ stats.recordatoriosCount }}</p>
            </div>
          </div>
        </div>

        <!-- Search bar -->
        <form @submit.prevent="buscar_enlace()" class="relative mt-3">
          <input
            v-model="data_busqueda"
            class="input-field pl-10 pr-4"
            type="text"
            placeholder="Buscar enlace..."
          />
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <button type="submit" class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-slate-700/50 transition-colors">
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>
        </form>
      </div>

      <div v-if="notificationPermission !== 'granted'" class="mx-4 mb-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-medium text-white">Notificaciones</p>
            <p class="mt-1 text-xs text-slate-400">{{ notificationPermissionMessage || 'Activa las alertas para recibir recordatorios de tus enlaces.' }}</p>
          </div>
          <button @click="solicitarPermisosNotificaciones" class="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-medium text-white">
            {{ notificationPermission === 'denied' ? 'Reintentar' : 'Activar' }}
          </button>
        </div>
      </div>

      <section v-if="upcomingReminders.length" class="mx-4 mb-4 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-800/80 p-4 shadow-lg">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">Próximos recordatorios</p>
            <h3 class="mt-1 text-sm font-semibold text-white">Lo que vence pronto</h3>
          </div>
          <span class="rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-[11px] text-slate-400">
            {{ upcomingReminders.length }} pendientes
          </span>
        </div>

        <div class="mt-3 space-y-2">
          <div v-for="item in upcomingReminders" :key="item.enlace_url + item.reminder_at" class="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-white">{{ item.nombre }}</p>
                <p class="mt-1 text-xs text-slate-400">{{ item.descripcion || 'Sin descripción' }}</p>
              </div>
              <div class="text-right">
                <p class="text-[11px] uppercase tracking-[0.24em] text-slate-500">{{ new Date(item.reminder_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) }}</p>
                <p class="mt-1 text-sm font-medium text-blue-300">{{ new Date(item.reminder_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories + Favorites -->
      <div class="px-4 pb-2 overflow-x-auto category-scroll-fade">
        <div class="flex items-center gap-2 min-w-max pb-1">
          <button @click="abrir_registro_categoria()" class="category-pill-inactive flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nueva
          </button>

          <button
            @click="filtar_elementos = '- todos'"
            :class="filtar_elementos === '- todos' || filtar_elementos === '' ? 'category-pill-active' : 'category-pill-inactive'"
          >
            Todos
          </button>

          <button
            @click="filtar_elementos = '- favoritos'"
            :class="filtar_elementos === '- favoritos' ? 'category-pill-active' : 'category-pill-inactive'"
          >
            <svg class="w-3.5 h-3.5 inline mr-1 -mt-0.5" :class="filtar_elementos === '- favoritos' ? 'text-yellow-500' : ''" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
            Favoritos
          </button>

          <button
            v-for="(categoria, index) in categorias"
            :key="index"
            @click="filtar_elementos = categoria"
            :class="filtar_elementos === categoria ? 'category-pill-active' : 'category-pill-inactive'"
            class="group relative"
          >
            {{ categoria }}
            <span @click.stop="abrir_eliminar_categoria(categoria)" class="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-400">
              <svg class="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </span>
          </button>
        </div>
      </div>

      <!-- Sort bar -->
      <div class="px-4 pb-3 flex flex-wrap items-center gap-2">
        <span class="text-xs font-medium text-slate-500">Ordenar:</span>
        <div class="flex flex-wrap gap-1">
          <button @click="sortOption = 'fecha'" :class="sortOption === 'fecha' ? 'text-white bg-slate-700/50' : 'text-slate-400 hover:text-white'" class="text-xs px-2.5 py-1 rounded-lg transition-colors">
            Más recientes
          </button>
          <button @click="sortOption = 'nombre'" :class="sortOption === 'nombre' ? 'text-white bg-slate-700/50' : 'text-slate-400 hover:text-white'" class="text-xs px-2.5 py-1 rounded-lg transition-colors">
            Nombre A-Z
          </button>
          <button @click="sortOption = 'nombre_desc'" :class="sortOption === 'nombre_desc' ? 'text-white bg-slate-700/50' : 'text-slate-400 hover:text-white'" class="text-xs px-2.5 py-1 rounded-lg transition-colors">
            Nombre Z-A
          </button>
          <button @click="sortOption = 'categoria'" :class="sortOption === 'categoria' ? 'text-white bg-slate-700/50' : 'text-slate-400 hover:text-white'" class="text-xs px-2.5 py-1 rounded-lg transition-colors">
            Categoría
          </button>
        </div>
      </div>
    </header>

    <!-- Link list -->
    <main class="px-4 mt-4">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <h2 class="text-sm font-medium text-slate-300">
            Enlaces
            <span v-if="indicador_categoria" class="text-slate-500">· {{ indicador_categoria.replace('- ', '') }}</span>
          </h2>
          <p class="text-xs text-slate-500">Tu colección organizada y lista para revisar.</p>
        </div>
        <span class="rounded-full border border-slate-800 bg-slate-900/70 px-2.5 py-1 text-xs text-slate-400">{{ enlaces.length }} enlaces</span>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="space-y-3">
        <div v-for="n in 5" :key="n" class="card p-4 flex items-center gap-3">
          <div class="skeleton w-10 h-10 rounded-xl flex-shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="skeleton h-4 w-3/5 rounded"></div>
            <div class="skeleton h-3 w-4/5 rounded"></div>
          </div>
          <div class="skeleton w-9 h-9 rounded-xl flex-shrink-0"></div>
        </div>
      </div>

      <div v-else-if="enlaces.length > 0">
        <div v-for="(card, index) in enlaces" :key="index" class="mb-3" :style="{ animationDelay: index * 0.05 + 's' }">
          <div class="card-enter">
            <enlaces :datosEnlace="card"/>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="flex flex-col items-center justify-center py-24 select-none">
        <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
        <p class="text-slate-500 font-medium mb-1">
          {{ filtar_elementos === '- favoritos' ? 'Sin favoritos' : 'No hay enlaces aquí' }}
        </p>
        <p class="text-slate-600 text-sm mb-4">
          {{ filtar_elementos === '- favoritos' ? 'Marca enlaces como favoritos con la estrella' : 'Agrega tu primer enlace para empezar' }}
        </p>
        <button @click="abrir_registro_enlaces()" class="btn-primary !w-auto px-6 !h-10 text-sm">
          <svg class="w-4 h-4 inline mr-1.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nuevo enlace
        </button>
      </div>
    </main>

    <!-- FAB -->
    <div class="fixed bottom-8 right-6 z-20">
      <button @click="abrir_registro_enlaces()" class="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center transition-all duration-200 active:scale-95">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
      </button>
    </div>

  </div>
</template>
