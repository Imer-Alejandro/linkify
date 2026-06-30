<script>
import { emitter } from '@/eventBus';
import localforage from 'localforage';

export default {
    props:['id_categoria'],
   methods:{
     cerrar_eliminar_categoria(){
        emitter.emit('cerrar_eliminar_categoria')
     },
     eliminar_categoria(nombreCategoria) {
    localforage.getItem("token_categoria")
    .then(listado => {
      let listado_categoria = JSON.parse(listado) || [];
      listado_categoria = listado_categoria.filter(item => item !== nombreCategoria);
      return localforage.setItem("token_categoria", JSON.stringify(listado_categoria));
    })
    .then(() => {
        this.eliminar_enlaces_categoria(this.id_categoria);
        this.cerrar_eliminar_categoria();
    })
    .catch(err => {
      console.error(err);
    });
},
    eliminar_enlaces_categoria(nombreCategoria){
        localforage.getItem("token_enlace")
        .then(listadoEnlaces=>{
            let nuevoListadoEnlaces = JSON.parse(listadoEnlaces).filter(element=>{
                return element.categoria !==  nombreCategoria;
            })
            localforage.setItem("token_enlace",JSON.stringify(nuevoListadoEnlaces))
        })
        .catch(err=>{console.error(err)})
    }
   }
}
</script>
<template>
    <div class="overlay" @click.self="cerrar_eliminar_categoria()">
        <div class="bottom-sheet max-h-[50vh]">
            <div class="flex items-center justify-between p-4 border-b border-slate-700/50">
                <h3 class="text-lg font-semibold">Eliminar categoría</h3>
                <button @click="cerrar_eliminar_categoria" class="p-2 hover:bg-slate-700/50 rounded-xl transition-colors">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="p-4 space-y-4">
                <p class="text-slate-300 text-sm leading-relaxed">
                    ¿Estás seguro de eliminar la categoría <strong class="text-white">"{{ id_categoria }}"</strong>?
                    Todos los enlaces asociados también serán eliminados.
                </p>
                <button @click="eliminar_categoria(this.id_categoria)" class="btn-danger">
                    Eliminar categoría y sus enlaces
                </button>
            </div>
        </div>
    </div>
</template>
