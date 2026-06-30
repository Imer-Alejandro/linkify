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
      mostrarExportExcel:false
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

        // Filter by category
        if (this.filtar_elementos && this.filtar_elementos !== '- todos' && this.filtar_elementos !== '- favoritos') {
          items = items.filter(e => e.categoria === this.filtar_elementos)
        } else if (this.filtar_elementos === '- favoritos') {
          items = items.filter(e => e.favorito)
        }

        // Sort
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
          // Update the reactive copy too
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
  },
}
</script>

<template>
  <div class="min-h-screen bg-[#0f172a] pb-32">

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
    <header class="sticky top-0 z-30 bg-[#0f172a]/90 backdrop-blur-xl border-b border-slate-800">
      <div class="px-4 pt-4 pb-3">
        <div class="flex items-center justify-between mb-3">
          <h1 class="text-xl font-bold tracking-tight">Links</h1>
          <div class="flex items-center gap-1">
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

        <!-- Search bar -->
        <form @submit.prevent="buscar_enlace()" class="relative">
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

      <!-- Categories + Favorites -->
      <div class="px-4 pb-2 overflow-x-auto">
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
      <div class="px-4 pb-3 flex items-center gap-2">
        <span class="text-xs text-slate-500 font-medium">Ordenar:</span>
        <div class="flex gap-1">
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
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm text-slate-400 font-medium">
          Enlaces
          <span v-if="indicador_categoria" class="text-slate-500">· {{ indicador_categoria.replace('- ', '') }}</span>
        </h2>
        <span class="text-xs text-slate-500">{{ enlaces.length }} enlaces</span>
      </div>

      <div v-if="enlaces.length > 0">
        <div v-for="(card, index) in enlaces" :key="index" class="mb-3">
          <enlaces :datosEnlace="card"/>
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center py-20 text-slate-500">
        <svg class="w-12 h-12 mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
        </svg>
        <p class="text-sm">No hay enlaces todavía</p>
        <button @click="abrir_registro_enlaces()" class="mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors">
          Agregar tu primer enlace
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
