<script>
import { emitter } from '@/eventBus';
import localforage from 'localforage';

export default {
    props:['datos_enlace'],
   methods:{
     cerrar_eliminar_enlace(){
        emitter.emit('cerrar_eliminar_enlace')
     },
     eliminar_enlace(){
        localforage.getItem('token_enlace')
        .then(listadoEnlaces=>{
            let nuevoListado= JSON.parse(listadoEnlaces).filter(element=>{
              return  element.nombre!==this.datos_enlace.nombre
                && element.enlace_url !== this.datos_enlace.enlace_url
            })
            localforage.setItem('token_enlace',JSON.stringify(nuevoListado))
            .then(()=>{
                console.log('enlace eliminado')
            })
            .catch((err)=>{
                console.log(err)
            })
        })
        .catch( (err) =>{
            console.error(err)
        })
        .finally(()=>{
            this.cerrar_eliminar_enlace();
        })
     }
   }
}
</script>
<template>
    <div class="overlay" @click.self="cerrar_eliminar_enlace()">
        <div class="bottom-sheet max-h-[50vh]">
            <div class="flex items-center justify-between p-4 border-b border-slate-700/50">
                <h3 class="text-lg font-semibold">Eliminar enlace</h3>
                <button @click="cerrar_eliminar_enlace" class="p-2 hover:bg-slate-700/50 rounded-xl transition-colors">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="p-4 space-y-4">
                <p class="text-slate-300 text-sm leading-relaxed">
                    ¿Estás seguro de eliminar <strong class="text-white">"{{ datos_enlace.nombre }}"</strong>?
                </p>
                <button @click="eliminar_enlace()" class="btn-danger">
                    Eliminar enlace
                </button>
            </div>
        </div>
    </div>
</template>
