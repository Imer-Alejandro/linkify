<script>
import { emitter } from '@/eventBus'
export default {
    props:['datosEnlace'],
    methods:{
        abrir_detalles(){
            emitter.emit('abrir_detalles_enlace',this.datosEnlace)
        },
        toggleFavorito(e){
            e.stopPropagation()
            emitter.emit('toggle_favorito_enlace', this.datosEnlace)
        },
    }
}
</script>
<template>
    <div @click="abrir_detalles()" class="card-hover p-3 flex items-center gap-3 cursor-pointer group relative">
        <!-- Favorite star -->
        <button @click="toggleFavorito" class="absolute top-2 right-2 transition-colors">
            <svg v-if="datosEnlace.favorito" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
            <svg v-else class="w-4 h-4 text-slate-500 hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
        </button>

        <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center overflow-hidden">
            <div v-if="datosEnlace.origen == 'facebook'">
                <img class="w-5 h-5" src="/facebook_1.png" alt="">
            </div>
            <div v-else-if="datosEnlace.origen == 'instagram'">
                <img class="w-5 h-5" src="/instagram_1.png" alt="">
            </div>
            <div v-else-if="datosEnlace.origen == 'tiktok'">
                <img class="w-5 h-5" src="/tik-tok.png" alt="">
            </div>
            <div v-else-if="datosEnlace.origen == 'youtube'">
                <img class="w-5 h-5" src="/youtube.png" alt="">
            </div>
            <div v-else-if="datosEnlace.origen == 'pinterest'">
                <img class="w-5 h-5" src="/pinterest.png" alt="">
            </div>
            <div v-else>
                <img class="w-5 h-5" src="/red-mundial.png" alt="">
            </div>
        </div>

        <div class="flex-1 min-w-0">
            <h3 class="text-white font-medium text-sm truncate">{{ datosEnlace.nombre }}</h3>
            <p v-if="datosEnlace.descripcion" class="text-slate-400 text-xs truncate mt-0.5">
                {{ datosEnlace.descripcion }}
            </p>
            <p v-else class="text-slate-500 text-xs mt-0.5">Sin descripción</p>
            <!-- Tags -->
            <div v-if="datosEnlace.tags && datosEnlace.tags.length > 0" class="flex gap-1 mt-1.5 flex-wrap">
                <span v-for="(tag, i) in datosEnlace.tags.slice(0, 2)" :key="i" class="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-600/20 text-blue-300">
                    {{ tag }}
                </span>
                <span v-if="datosEnlace.tags.length > 2" class="text-[10px] text-slate-400">
                    +{{ datosEnlace.tags.length - 2 }}
                </span>
            </div>
        </div>

        <a :href="datosEnlace.enlace_url" target="_blank" @click.stop>
            <div class="flex-shrink-0 w-9 h-9 rounded-xl bg-slate-700/50 hover:bg-blue-600/20 flex items-center justify-center transition-colors">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
            </div>
        </a>
    </div>
</template>
