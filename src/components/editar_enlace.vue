<script>
import { emitter } from '@/eventBus';
import { toast } from 'vue3-toastify';
import localforage from 'localforage';
export default {
    props:['datos_enlace'],
    mounted(){
        this.consultar_categorias();
    },
    data(){
        return{
            categorias_list:[],
            tagInput:'',
            enlace:{
                enlace_url:this.datos_enlace.enlace_url,
                nombre:this.datos_enlace.nombre,
                descripcion:this.datos_enlace.descripcion,
                categoria:this.datos_enlace.categoria,
                origen:'',
                favorito: this.datos_enlace.favorito || false,
                fecha_creacion: this.datos_enlace.fecha_creacion || Date.now(),
                tags: this.datos_enlace.tags ? [...this.datos_enlace.tags] : []
            }
        }
    },
    methods:{
        cerrar_editar_enlace(){
            emitter.emit('cerrar_editar_enlaces')
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
        guardarEnlaceEditado(){
            let nuevoListado =[]
            if (this.enlace.enlace_url != this.datos_enlace.enlace_url) {
                this.enlace.origen= this.determinar_origen(this.enlace.enlace_url);
            }else{
                this.enlace.origen= this.datos_enlace.origen;
            }
            localforage.getItem('token_enlace')
            .then(listEnlaces => {
                nuevoListado = JSON.parse(listEnlaces).filter(element => {
                return element.enlace_url !== this.datos_enlace.enlace_url
                    && element.nombre !== this.datos_enlace.nombre;
                });
                nuevoListado.unshift(this.enlace);
                localforage.setItem("token_enlace", JSON.stringify(nuevoListado))
                .then(() => {
                    toast.success("Enlace actualizado");
                })
                .catch((err) => {
                    console.error(err);
                });
            })
            .catch(err=>{
                console.error('error obteniendo el listado',err)
            })
            .finally( () => {
                this.cerrar_editar_enlace()
            });
        },
        determinar_origen(url){
            const patrones = {
                facebook: /(?:https?:\/\/)?(?:www\.)?facebook\.(com|es)/,
                instagram: /(?:https?:\/\/)?(?:www\.)?instagram\.(com|es)/,
                tiktok: /(?:https?:\/\/)?(?:www\.)?tiktok\.(com|es)/,
                youtube: /(?:https?:\/\/)?(?:www\.)?youtube\.(com|es)/,
                pinterest: /(?:https?:\/\/)?(?:www\.)?pinterest\.(com|es)/,
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
    <div class="overlay" @click.self="cerrar_editar_enlace()">
         <div class="bottom-sheet max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between p-4 border-b border-slate-700/50">
                <h3 class="text-lg font-semibold">Editar enlace</h3>
                <button @click="cerrar_editar_enlace()" class="p-2 hover:bg-slate-700/50 rounded-xl transition-colors">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <form @submit.prevent="guardarEnlaceEditado()" class="p-4 space-y-4">
                <div class="space-y-1.5">
                    <label class="text-sm text-slate-400 font-medium">URL del enlace</label>
                    <input v-model="enlace.enlace_url" required class="input-field" type="url" placeholder="https://ejemplo.com">
                </div>

                <div class="space-y-1.5">
                    <label class="text-sm text-slate-400 font-medium">Nombre</label>
                    <input v-model="enlace.nombre" maxlength="65" required class="input-field" type="text">
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
                    <textarea v-model="enlace.descripcion" maxlength="640" class="input-field min-h-[80px] pt-3 resize-none"></textarea>
                </div>

                <button type="submit" class="btn-primary">
                    Guardar cambios
                </button>
            </form>
        </div>
    </div>
</template>
