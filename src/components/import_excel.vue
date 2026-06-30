<script>
import localforage from 'localforage';
import { parseExcelFile, downloadTemplate } from '@/services/excel';
import { toast } from 'vue3-toastify';

export default {
  emits: ['close', 'imported'],
  data() {
    return {
      dragOver: false,
      importing: false,
      preview: null,
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    handleDrop(e) {
      e.preventDefault()
      this.dragOver = false
      const file = e.dataTransfer.files[0]
      if (file) this.processFile(file)
    },
    handleFileInput(e) {
      const file = e.target.files[0]
      if (file) this.processFile(file)
    },
    async processFile(file) {
      if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
        toast.error('Formato no soportado. Usa .xlsx, .xls o .csv')
        return
      }
      this.importing = true
      try {
        const result = await parseExcelFile(file)
        if (result.errors.length > 0) {
          toast.warning(`${result.errors.length} filas tienen errores`)
        }
        if (result.data.length === 0) {
          toast.error('El archivo no contiene datos válidos')
          this.importing = false
          return
        }
        this.preview = result
      } catch (err) {
        toast.error(err.message)
      }
      this.importing = false
    },
    async confirmImport() {
      if (!this.preview || this.preview.data.length === 0) return
      this.importing = true
      try {
        const existing = await localforage.getItem('token_enlace')
        let enlaces = existing ? JSON.parse(existing) : []
        let added = 0
        for (const item of this.preview.data) {
          const exists = enlaces.some(e => e.enlace_url === item.enlace_url || e.nombre === item.nombre)
          if (!exists) {
            enlaces.unshift({
              ...item,
              origen: this.determinar_origen(item.enlace_url),
              favorito: false,
              fecha_creacion: Date.now(),
            })
            added++
          }
        }
        // Also ensure categories exist
        const catRaw = await localforage.getItem('token_categoria')
        let categorias = catRaw ? JSON.parse(catRaw) : []
        for (const item of this.preview.data) {
          if (item.categoria && !categorias.includes(item.categoria)) {
            categorias.unshift(item.categoria)
          }
        }
        await localforage.setItem('token_enlace', JSON.stringify(enlaces))
        await localforage.setItem('token_categoria', JSON.stringify(categorias))
        toast.success(`${added} enlaces importados correctamente`)
        this.preview = null
        this.$emit('imported')
        this.close()
      } catch (err) {
        toast.error('Error al importar: ' + err.message)
      }
      this.importing = false
    },
    determinar_origen(url) {
      const patrones = {
        facebook: /(?:https?:\/\/)?(?:www\.)?facebook\.(com|es)/,
        instagram: /(?:https?:\/\/)?(?:www\.)?instagram\.(com|es)/,
        tiktok: /(?:https?:\/\/)?(?:www\.)?tiktok\.(com|es)/,
        youtube: /(?:https?:\/\/)?(?:www\.)?(youtube|youtu)\.(com|es|be)/,
        pinterest: /(?:https?:\/\/)?(?:www\.)?(pinterest|pin)\.(com|es|it)/,
      }
      for (const origen in patrones) {
        if (patrones[origen].test(url)) return origen
      }
      return 'global'
    },
  }
}
</script>

<template>
  <div class="overlay" @click.self="close">
    <div class="bottom-sheet max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between p-4 border-b border-slate-700/50">
        <h3 class="text-lg font-semibold">Importar Excel</h3>
        <button @click="close" class="p-2 hover:bg-slate-700/50 rounded-xl transition-colors">
          <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="p-4 space-y-4">
        <!-- Download template -->
        <div class="flex items-center justify-between bg-slate-700/30 rounded-xl p-3">
          <div class="text-sm text-slate-300">
            <span class="block font-medium">¿No tienes un archivo?</span>
            <span class="text-slate-400 text-xs">Descarga la plantilla de ejemplo</span>
          </div>
          <button @click="downloadTemplate()" class="btn-ghost text-blue-400 hover:text-blue-300 text-xs">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Descargar plantilla
          </button>
        </div>

        <!-- Drop zone -->
        <div
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop="handleDrop"
          :class="[
            'border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200',
            dragOver ? 'border-blue-500 bg-blue-500/5' : 'border-slate-600 hover:border-slate-500'
          ]"
        >
          <input type="file" accept=".xlsx,.xls,.csv" @change="handleFileInput" ref="fileInput" class="hidden">
          <div v-if="!importing && !preview">
            <svg class="w-10 h-10 text-slate-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
            </svg>
            <p class="text-sm text-slate-400 mb-2">Arrastra tu archivo Excel aquí o</p>
            <button @click="$refs.fileInput.click()" class="text-sm text-blue-400 hover:text-blue-300 font-medium">
              Seleccionar archivo
            </button>
            <p class="text-xs text-slate-500 mt-2">Formatos: .xlsx, .xls, .csv</p>
          </div>
          <div v-else-if="importing" class="flex items-center justify-center gap-2 text-slate-400">
            <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span>Procesando...</span>
          </div>
        </div>

        <!-- Preview -->
        <div v-if="preview">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-medium text-slate-300">
              Vista previa
              <span class="text-slate-500 ml-1">({{ preview.data.length }} registros)</span>
            </h4>
            <span v-if="preview.errors.length > 0" class="text-xs text-amber-400">
              {{ preview.errors.length }} errores
            </span>
          </div>

          <div class="bg-slate-900/50 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-slate-700 text-slate-400 text-xs">
                  <th class="text-left p-2 font-medium">Nombre</th>
                  <th class="text-left p-2 font-medium">URL</th>
                  <th class="text-left p-2 font-medium">Categoría</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in preview.data.slice(0, 10)" :key="i" class="border-b border-slate-800 text-slate-300">
                  <td class="p-2 truncate max-w-[100px]">{{ row.nombre }}</td>
                  <td class="p-2 truncate max-w-[120px]">{{ row.enlace_url }}</td>
                  <td class="p-2">{{ row.categoria }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="preview.errors.length > 0" class="mt-2 text-xs text-amber-400 bg-amber-400/10 rounded-xl p-3">
            <p v-for="(err, i) in preview.errors" :key="i">{{ err }}</p>
          </div>

          <div class="flex gap-3 mt-4">
            <button @click="preview = null" class="btn-ghost flex-1">Cancelar</button>
            <button @click="confirmImport" :disabled="importing" class="btn-primary flex-1">
              {{ importing ? 'Importando...' : `Importar ${preview.data.length} enlaces` }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
