<script>
import localforage from 'localforage'
import { toast } from 'vue3-toastify'

export default {
    props: ['url',"title", "text"],
    mounted(){
        this.consultar_categorias();
        this.validarUrl(this.title,this.url,this.text);
    },
    data(){
        return{
            categorias_list:[],
            mostrandoNuevaCategoria: false,
            nuevaCategoria: '',
            enlace:{
                enlace_url:"",
                nombre:"",
                descripcion:'',
                categoria:'',
                origen:'',
                favorito: false,
                fecha_creacion: Date.now(),
                tags: [],
                reminder_enabled: false,
                reminder_at: '',
                reminder_notified: false
            }
        }
    },
    methods:{
        regresar_inicio(){
            this.$router.push('/');
        },
        validarUrl(title, url, text){
            const regex = /(?:https?:\/\/[^\s?]+)/g;
            let urlExtraida = '';
            if (title) {
                const titleMatches = title.match(regex);
                if (titleMatches && titleMatches.length > 0) {
                    urlExtraida = titleMatches[0];
                }
            }
            if (!urlExtraida && text) {
                const textMatches = text.match(regex);
                if (textMatches && textMatches.length > 0) {
                    urlExtraida = textMatches[0];
                }
            }
            if (!urlExtraida && url) {
                const urlMatches = url.match(regex);
                if (urlMatches && urlMatches.length > 0) {
                    urlExtraida = urlMatches[0];
                }
            }
            this.enlace.enlace_url = urlExtraida;
        },
        crearCategoria(){
            const nombre = this.nuevaCategoria.trim()
            if (!nombre) return
            localforage.getItem('token_categoria')
            .then(datos => {
                let categorias = datos ? JSON.parse(datos) : []
                if (categorias.includes(nombre)) {
                    toast.error('La categoría ya existe')
                    return
                }
                categorias.unshift(nombre)
                return localforage.setItem('token_categoria', JSON.stringify(categorias))
            })
            .then(() => {
                this.categorias_list.unshift(this.nuevaCategoria.trim())
                this.enlace.categoria = this.nuevaCategoria.trim()
                this.nuevaCategoria = ''
                this.mostrandoNuevaCategoria = false
                toast.success('Categoría creada')
            })
            .catch(err => console.error(err))
        },
        registrar_enlace() {
            if (this.enlace.categoria === '') {
                toast.error("Debe indicar una categoría");
                return
            }
            if (this.enlace.reminder_enabled && !this.enlace.reminder_at) {
                toast.error("Debe seleccionar fecha y hora para el recordatorio");
                return
            }
            localforage.getItem('token_enlace')
            .then(datosAlmacenados => {
                if (datosAlmacenados !== null) {
                    let listado_enlaces = JSON.parse(datosAlmacenados);
                    const enlaceExistente = listado_enlaces.find(element =>
                        element.nombre === this.enlace.nombre || element.enlace_url === this.enlace.enlace_url
                    );
                    if (enlaceExistente) {
                        toast.error("Ya existe un enlace con el mismo nombre o URL.");
                        return;
                    }
                    this.enlace.origen = this.determinar_origen(this.enlace.enlace_url);
                    listado_enlaces.unshift(this.enlace);
                    return localforage.setItem('token_enlace', JSON.stringify(listado_enlaces));
                }
                let nuevo_listado_enlace = [this.enlace];
                return localforage.setItem('token_enlace', JSON.stringify(nuevo_listado_enlace));
            })
            .then(() => {
                toast.success('Enlace guardado')
                this.regresar_inicio();
            })
            .catch(error => {
                console.error('Error al almacenar/recuperar datos:', error);
            });
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
            .then((datos) => {
                this.categorias_list = datos ? JSON.parse(datos) : []
            })
            .catch((err) => {
                console.error("error en la categoria" + err)
            })
        }
    }
}
</script>
<template>
    <div class="min-h-screen bg-[#0f172a]">
        <div class="min-h-screen flex flex-col">
            <!-- Header -->
            <header class="sticky top-0 z-30 bg-[#0f172a]/90 backdrop-blur-xl border-b border-slate-800">
                <div class="flex items-center justify-between px-4 h-14">
                    <div class="flex items-center gap-3">
                        <button @click="regresar_inicio()" class="p-2 -ml-2 hover:bg-slate-800 rounded-xl transition-colors">
                            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                            </svg>
                        </button>
                        <h1 class="text-lg font-semibold">Nuevo enlace</h1>
                    </div>
                </div>
            </header>

            <!-- Form -->
            <form @submit.prevent="registrar_enlace()" class="flex-1 p-4 space-y-5 overflow-y-auto pb-8">
                <!-- URL preview -->
                <div class="card p-3 flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm text-slate-300 truncate">{{ enlace.enlace_url || 'https://...' }}</p>
                        <p class="text-xs text-slate-500 mt-0.5">Enlace a guardar</p>
                    </div>
                </div>

                <div class="space-y-1.5">
                    <label class="text-sm text-slate-400 font-medium">Nombre del enlace</label>
                    <input v-model="enlace.nombre" maxlength="65" required class="input-field" type="text" placeholder="Ej: Mi artículo favorito">
                </div>

                <!-- Category with inline creation -->
                <div class="space-y-1.5">
                    <label class="text-sm text-slate-400 font-medium">Categoría</label>
                    <select v-model="enlace.categoria" required class="select-field">
                        <option value="" disabled>Seleccionar categoría</option>
                        <option v-for="(categoria, index) in categorias_list" :key="index" :value="categoria">
                            {{ categoria }}
                        </option>
                    </select>

                    <!-- Inline create category -->
                    <div v-if="!mostrandoNuevaCategoria" class="mt-2">
                        <button @click.prevent="mostrandoNuevaCategoria = true" type="button" class="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                            </svg>
                            Crear nueva categoría
                        </button>
                    </div>
                    <div v-else class="mt-2 flex gap-2">
                        <input v-model="nuevaCategoria" maxlength="35" class="input-field flex-1" type="text" placeholder="Nombre de la categoría" @keydown.enter.prevent="crearCategoria">
                        <button @click.prevent="crearCategoria" type="button" class="btn-primary !w-auto px-4">Crear</button>
                        <button @click.prevent="mostrandoNuevaCategoria = false; nuevaCategoria = ''" type="button" class="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancelar</button>
                    </div>
                </div>

                <div class="space-y-1.5">
                    <label class="text-sm text-slate-400 font-medium">Descripción <span class="text-slate-500">(opcional)</span></label>
                    <textarea v-model="enlace.descripcion" maxlength="640" class="input-field min-h-[90px] pt-3 resize-none" placeholder="Añadir descripción..."></textarea>
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

                <button type="submit" class="btn-primary">
                    Guardar enlace
                </button>
            </form>
        </div>
    </div>
</template>
