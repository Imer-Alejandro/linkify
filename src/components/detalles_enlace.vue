<script>
import { emitter } from '@/eventBus';
import axios from 'axios';

export default {
    mounted(){
        this.obtener_vista_previa();
    },
    props:['datos_enlace'],
    data(){
        return{
            visibilidad_menu_plegable: false,
            previewImage: null,
        }
    },
    methods:{
        cerrar_detalles_enlace(){
            emitter.emit('cerrar_detalles_enlace')
        },
        toggleFavorito(){
            emitter.emit('toggle_favorito_enlace', this.datos_enlace)
        },
        open_menu_plegable_and_close(){
            this.visibilidad_menu_plegable= !this.visibilidad_menu_plegable
        },
        abrir_editar_enlace(){
            emitter.emit('abrir_editar_enlace',this.datos_enlace)
        },
        abrir_eliminar(){
            emitter.emit('abrir_eliminar_enlace',this.datos_enlace )
        },
        compartir_enlace(){
            if (navigator.share) {
                navigator.share({
                url: this.datos_enlace.enlace_url
                })
                .then(() => console.log('Contenido compartido con éxito.'))
                .catch((error) => console.error('Error al compartir:', error));
            } else {
                console.error('La API de Web Share no está soportada en este navegador.');
            }
        },
        async obtener_vista_previa(){
            try {
        const response = await axios.get('https://api.microlink.io?url=' + encodeURIComponent(this.datos_enlace.enlace_url));
        this.previewImage = response.data.data.image.url;
      } catch (error) {
        console.error('Error al obtener la vista previa:', error.response ? error.response.data : error.message);
      }
        }
    }
}
</script>

<template>
    <div class="overlay" @click.self="cerrar_detalles_enlace()">
        <div class="bottom-sheet max-h-[90vh] overflow-y-auto">
            <!-- Preview image -->
            <div class="relative h-48 bg-slate-700 overflow-hidden rounded-t-2xl">
                <img v-if="previewImage" class="w-full h-full object-cover" :src="previewImage" alt="">
                <div v-else class="w-full h-full flex items-center justify-center text-slate-500">
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                </div>
                <!-- Close button -->
                <button @click="cerrar_detalles_enlace()" class="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/60 transition-colors">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
                <!-- Favorite button -->
                <button @click="toggleFavorito" class="absolute top-3 left-3 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/60 transition-colors">
                    <svg v-if="datos_enlace.favorito" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                    </svg>
                    <svg v-else class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                    </svg>
                </button>
                <!-- Social icon badge -->
                <div class="absolute bottom-3 left-3 w-12 h-12 bg-slate-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <div v-if="datos_enlace.origen == 'facebook'">
                        <img class="w-6 h-6" src="/facebook_1.png" alt="">
                    </div>
                    <div v-else-if="datos_enlace.origen == 'instagram'">
                        <img class="w-6 h-6" src="/instagram_1.png" alt="">
                    </div>
                    <div v-else-if="datos_enlace.origen == 'tiktok'">
                        <img class="w-6 h-6" src="/tik-tok.png" alt="">
                    </div>
                    <div v-else-if="datos_enlace.origen == 'youtube'">
                        <img class="w-6 h-6" src="/youtube.png" alt="">
                    </div>
                    <div v-else-if="datos_enlace.origen == 'pinterest'">
                        <img class="w-6 h-6" src="/pinterest.png" alt="">
                    </div>
                    <div v-else>
                        <img class="w-6 h-6" src="/red-mundial.png" alt="">
                    </div>
                </div>
                <!-- Menu button -->
                <button @click="open_menu_plegable_and_close()" class="absolute bottom-3 right-3 w-8 h-8 bg-slate-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                    </svg>
                </button>
                <!-- Dropdown menu -->
                <div v-show="visibilidad_menu_plegable" class="absolute bottom-14 right-3 w-36 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
                    <button @click="abrir_editar_enlace()" class="w-full px-4 py-2.5 text-sm text-left text-slate-200 hover:bg-slate-700/50 transition-colors flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        Editar
                    </button>
                    <button @click="compartir_enlace()" class="w-full px-4 py-2.5 text-sm text-left text-slate-200 hover:bg-slate-700/50 transition-colors flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                        </svg>
                        Compartir
                    </button>
                    <button @click="abrir_eliminar()" class="w-full px-4 py-2.5 text-sm text-left text-red-400 hover:bg-red-600/10 transition-colors flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                        Eliminar
                    </button>
                </div>
            </div>

            <!-- Content -->
            <div class="p-4 space-y-4">
                <!-- Favorite indicator inline -->
                <div class="flex items-center gap-3">
                    <h3 class="text-xl font-semibold flex-1">{{ datos_enlace.nombre }}</h3>
                    <span v-if="datos_enlace.favorito" class="text-xs text-yellow-400 flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                        </svg>
                        Favorito
                    </span>
                </div>

                <div>
                    <span class="text-xs text-slate-500 font-medium uppercase tracking-wider">Categoría</span>
                    <div class="mt-1">
                        <span class="inline-flex px-3 py-1 bg-slate-700/50 rounded-full text-sm text-slate-300">
                            {{ datos_enlace.categoria }}
                        </span>
                    </div>
                </div>

                <!-- Tags -->
                <div v-if="datos_enlace.tags && datos_enlace.tags.length > 0">
                    <span class="text-xs text-slate-500 font-medium uppercase tracking-wider">Tags</span>
                    <div class="flex gap-1.5 mt-1.5 flex-wrap">
                        <span v-for="(tag, i) in datos_enlace.tags" :key="i" class="px-2.5 py-0.5 bg-blue-600/20 text-blue-300 rounded-full text-xs">
                            {{ tag }}
                        </span>
                    </div>
                </div>

                <div>
                    <span class="text-xs text-slate-500 font-medium uppercase tracking-wider">Descripción</span>
                    <p v-if="datos_enlace.descripcion" class="mt-1 text-sm text-slate-300 leading-relaxed">
                        {{ datos_enlace.descripcion }}
                    </p>
                    <p v-else class="mt-1 text-sm text-slate-500 italic">Sin descripción</p>
                </div>

                <div>
                    <span class="text-xs text-slate-500 font-medium uppercase tracking-wider">URL</span>
                    <p class="mt-1 text-sm text-blue-400 break-all">{{ datos_enlace.enlace_url }}</p>
                </div>

                <a :href="datos_enlace.enlace_url" target="_blank" class="btn-primary inline-flex items-center justify-center gap-2 mt-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                    Abrir enlace
                </a>
            </div>
        </div>
    </div>
</template>
