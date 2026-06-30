<script>
import localforage from 'localforage';
import { toast } from 'vue3-toastify';
import { exportToExcel } from '@/services/excel';

export default {
  emits: ['close'],
  mounted() {
    this.loadCategories()
  },
  data() {
    return {
      categorias: [],
      categoriaSeleccionada: 'todas',
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    loadCategories() {
      localforage.getItem('token_categoria')
        .then(datos => {
          this.categorias = datos ? JSON.parse(datos) : []
        })
        .catch(err => console.error(err))
    },
    async exportAll() {
      try {
        const data = await localforage.getItem('token_enlace')
        const enlaces = data ? JSON.parse(data) : []
        if (enlaces.length === 0) {
          toast.error('No hay enlaces para exportar')
          return
        }
        exportToExcel(enlaces, 'todos_los_enlaces.xlsx')
        toast.success('Exportación completada')
        this.close()
      } catch (err) {
        toast.error('Error al exportar: ' + err.message)
      }
    },
    async exportByCategory() {
      if (!this.categoriaSeleccionada) return
      try {
        const data = await localforage.getItem('token_enlace')
        const enlaces = data ? JSON.parse(data) : []
        const filtrados = enlaces.filter(e => e.categoria === this.categoriaSeleccionada)
        if (filtrados.length === 0) {
          toast.error('No hay enlaces en esta categoría')
          return
        }
        exportToExcel(filtrados, `enlaces_${this.categoriaSeleccionada}.xlsx`)
        toast.success('Exportación completada')
        this.close()
      } catch (err) {
        toast.error('Error al exportar: ' + err.message)
      }
    },
  }
}
</script>

<template>
  <div class="overlay" @click.self="close">
    <div class="bottom-sheet max-h-[70vh]">
      <div class="flex items-center justify-between p-4 border-b border-slate-700/50">
        <h3 class="text-lg font-semibold">Exportar a Excel</h3>
        <button @click="close" class="p-2 hover:bg-slate-700/50 rounded-xl transition-colors">
          <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="p-4 space-y-4">
        <button @click="exportAll()" class="card-hover w-full p-4 flex items-center gap-4 text-left">
          <div class="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div>
            <span class="block text-sm font-medium text-white">Todos los enlaces</span>
            <span class="text-xs text-slate-400">Exportar todos los enlaces sin filtro</span>
          </div>
        </button>

        <div class="card p-4">
          <span class="block text-sm font-medium text-white mb-3">Por categoría</span>
          <div class="space-y-3">
            <select v-model="categoriaSeleccionada" class="select-field">
              <option value="" disabled>Seleccionar categoría</option>
              <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
            </select>
            <button
              @click="exportByCategory()"
              :disabled="!categoriaSeleccionada"
              class="btn-primary"
            >
              Exportar {{ categoriaSeleccionada ? `"${categoriaSeleccionada}"` : '' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
