<script>
import { emitter } from '@/eventBus';
import { toast } from 'vue3-toastify';
import localforage from 'localforage';

export default {
    mounted(){
      this.consultar_categorias()
    },
    data(){
        return{
            categorias_list:[],
            tagInput:'',
            enlace:{
                enlace_url:'',
                nombre:'',
                descripcion:'',
                categoria:'',
                origen:'',
                favorito: false,
                fecha_creacion: Date.now(),
                tags: [],
                reminder_enabled: false,
                reminder_at: ''
            }
        }
    },
    methods:{
        cerrar_registro_enlace(){
            emitter.emit('cerrar_registro_enlace')
        },
        addTag(){
            const tag = this.tagInput.trim().toLowerCase()
            if (tag && !this.enlace.tags.includes(tag)) {
                this.enlace.tags.push(tag)
            }
            this.tagInput = ''
        },
        removeTag(index){
            this.enlace.tags.splice(index, 1)
        },
        registrar_enlace() {
  if (this.enlace.categoria === '') {
    toast.error("Debe indicar una categoría");
  } else {
    localforage.getItem('token_enlace')
      .then(datosAlmacenados => {
        if (datosAlmacenados !== null) {
            let listado_enlaces =JSON.parse(datosAlmacenados) ;
            const enlaceExistente = listado_enlaces.find(element =>
            element.nombre === this.enlace.nombre || element.enlace_url === this.enlace.enlace_url
            );
            if (enlaceExistente) {
              toast.error("Ya existe un enlace con el mismo nombre o URL.");
              return;
            }
            this.enlace.origen=this.determinar_origen(this.enlace.enlace_url);
            listado_enlaces.unshift(this.enlace);
            return localforage.setItem('token_enlace', JSON.stringify(listado_enlaces));
        }
        let nuevo_listado_enlace = [this.enlace];
        return localforage.setItem('token_enlace', JSON.stringify(nuevo_listado_enlace));
      })
      .then(() => {
        this.cerrar_registro_enlace();
      })
      .catch(error => {
        console.error('Error al almacenar/recuperar datos:', error);
      });
  }
},
        determinar_origen(url){
            const patrones = {
                facebook: /(?:https?:\/\/)?(?:www\.)?facebook\.(com|es)/,
                instagram: /(?:https?:\/\/)?(?:www\.)?instagram\.(com|es)/,
                tiktok: /(?:https?:\/\/)?(?:www\.)?tiktok\.(com|es)/,
                youtube: /(?:https?:\/\/)?(?:www\.)?(youtube|youtu)\.(com|es|be)/,
                pinterest: /(?:https?:\/\/)?(?:www\.)?(pinterest|pin)\.(com|es|it)/,
            };
            for (const origen in patrones) {
                if (patrones[origen].test(url)) {
                return origen;
                }
            }
            return "global";
        },
        consultar_categorias(){
            localforage.getItem("token_categoria")
                .then((datos)=>{
                    this.categorias_list=JSON.parse(datos);
                })
                .catch((err)=>{
                    console.error(err)
                })
        }
    }
}
</script>

<template>
   <div class="overlay" @click.self="cerrar_registro_enlace()">
        <div class="bottom-sheet max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between p-4 border-b border-slate-700/50">
                <h3 class="text-lg font-semibold">Nuevo enlace</h3>
                <button @click="cerrar_registro_enlace()" class="p-2 hover:bg-slate-700/50 rounded-xl transition-colors">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <form class="p-4 space-y-4" @submit.prevent="registrar_enlace()">
                <div class="space-y-1.5">
                    <label class="text-sm text-slate-400 font-medium">URL del enlace</label>
                    <input v-model="enlace.enlace_url" required class="input-field" type="url" placeholder="https://ejemplo.com">
                </div>

                <div class="space-y-1.5">
                    <label class="text-sm text-slate-400 font-medium">Nombre</label>
                    <input v-model="enlace.nombre" maxlength="65" required class="input-field" type="text" placeholder="Mi enlace">
                </div>

                <div class="space-y-1.5">
                    <label class="text-sm text-slate-400 font-medium">Categoría</label>
                    <select v-model="enlace.categoria" class="select-field">
                        <option value="" disabled>Seleccionar categoría</option>
                        <option v-for="(categoria, index) in categorias_list" :key="index" :value="categoria">
                            {{ categoria }}
                        </option>
                    </select>
                </div>

                <div class="space-y-1.5">
                    <label class="text-sm text-slate-400 font-medium">Tags <span class="text-slate-500">(opcional)</span></label>
                    <div class="flex gap-2 mb-2 flex-wrap">
                        <span v-for="(tag, i) in enlace.tags" :key="i" class="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs">
                            {{ tag }}
                            <button @click.prevent="removeTag(i)" class="hover:text-blue-100">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </span>
                    </div>
                    <div class="flex gap-2">
                        <input v-model="tagInput" @keydown.enter.prevent="addTag" @keydown.,.prevent="addTag" class="input-field flex-1" type="text" placeholder="Escribir tag y presionar Enter">
                        <button @click.prevent="addTag" type="button" class="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm transition-colors">+</button>
                    </div>
                </div>

                <div class="space-y-1.5">
                    <label class="text-sm text-slate-400 font-medium">Descripción <span class="text-slate-500">(opcional)</span></label>
                    <textarea v-model="enlace.descripcion" maxlength="640" class="input-field min-h-[80px] pt-3 resize-none" placeholder="Añadir descripción..."></textarea>
                </div>

                <div class="rounded-2xl border border-slate-700/70 bg-slate-900/50 p-3 space-y-3">
                    <label class="flex items-center justify-between gap-3 rounded-xl bg-slate-800/70 px-3 py-2 text-sm text-slate-300">
                        <span>Programar recordatorio</span>
                        <input v-model="enlace.reminder_enabled" type="checkbox" class="h-4 w-4 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500" />
                    </label>
                    <div v-if="enlace.reminder_enabled" class="space-y-1.5">
                        <label class="text-sm text-slate-400 font-medium">Fecha y hora</label>
                        <input v-model="enlace.reminder_at" class="input-field" type="datetime-local" />
                    </div>
                </div>

                <button type="submit" class="btn-primary mt-6">
                    Guardar enlace
                </button>
            </form>
        </div>
    </div>
</template>
