<script>
import card_enlace from "@/components/card_enlace.vue"
import { emitter } from '@/eventBus';
import localforage from 'localforage'

export default {
    props:['dato_busqueda'],
    mounted(){
        this.buscar_enlaces();
    },
    data(){
        return{
            listado_resultado:[],
        }
    },
    components:{
        "card-link":card_enlace
    },
    methods:{
        cerrar_busqueda_enlace(){
            emitter.emit('cerrar_busqueda_enlace')
        },
        buscar_enlaces(){
            localforage.getItem("token_enlace")
            .then(listadoEnlaces =>{
                if (listadoEnlaces != null){
                    this.listado_resultado= JSON.parse(listadoEnlaces).filter(element=>{
                        return element.nombre.toLowerCase().includes(this.dato_busqueda.toLowerCase())
                    })
                }
            })
        }
    }
}
</script>
<template>
    <div class="overlay" @click.self="cerrar_busqueda_enlace()">
        <div class="bottom-sheet max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between p-4 border-b border-slate-700/50">
                <h3 class="text-lg font-semibold">Resultados de búsqueda</h3>
                <button @click="cerrar_busqueda_enlace()" class="p-2 hover:bg-slate-700/50 rounded-xl transition-colors">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="p-4">
                <div class="flex items-center gap-2 mb-4">
                    <span class="text-sm text-slate-400">Encontrados:</span>
                    <span class="text-sm font-medium text-white bg-blue-600/20 px-2.5 py-0.5 rounded-full">{{ listado_resultado.length }}</span>
                </div>

                <div v-if="listado_resultado.length > 0" class="space-y-3">
                    <div v-for="(enlace, index) in listado_resultado" :key="index">
                        <card-link :datosEnlace="enlace"/>
                    </div>
                </div>
                <div v-else class="flex flex-col items-center justify-center py-16 text-slate-500">
                    <svg class="w-10 h-10 mb-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <p class="text-sm">No se encontraron coincidencias</p>
                </div>
            </div>
        </div>
    </div>
</template>
