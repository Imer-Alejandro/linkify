<script>
import { emitter } from '@/eventBus';
import localforage from 'localforage';
import { toast } from 'vue3-toastify';

export default {
    data(){
        return{
            nombre_categoria:''
        }
    },
    methods:{
        cerrar_registro_categoria(){
            emitter.emit('cerrar_registro_categoria')
        },
        registrar_categoria(){
            if (this.nombre_categoria === '') {
                return
            }
            localforage.getItem('token_categoria')
            .then(datosAlmacenados => {
                if (datosAlmacenados !== null) {
                    let listado_categoria = JSON.parse(datosAlmacenados)
                    if (listado_categoria.includes(this.nombre_categoria)) {
                        toast.error("La categoría ya existe")
                        return null
                    }
                    listado_categoria.unshift(this.nombre_categoria)
                    return localforage.setItem('token_categoria', JSON.stringify(listado_categoria))
                }
                let nuevo_listado_categoria = [this.nombre_categoria]
                return localforage.setItem('token_categoria', JSON.stringify(nuevo_listado_categoria))
            })
            .then(() => {
                this.cerrar_registro_categoria()
            })
            .catch(error => {
                console.error('Error al almacenar/recuperar datos:', error)
            })
        }
    }
}
</script>

<template>
    <div class="overlay" @click.self="cerrar_registro_categoria()">
        <div class="bottom-sheet">
            <div class="flex items-center justify-between p-4 border-b border-slate-700/50">
                <h3 class="text-lg font-semibold">Nueva categoría</h3>
                <button @click="cerrar_registro_categoria" class="p-2 hover:bg-slate-700/50 rounded-xl transition-colors">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <form @submit.prevent="registrar_categoria" class="p-4 space-y-4">
                <div class="space-y-1.5">
                    <label class="text-sm text-slate-400 font-medium">Nombre de la categoría</label>
                    <input v-model="nombre_categoria" maxlength="35" required class="input-field" type="text" placeholder="Ej: Redes sociales">
                </div>
                <button type="submit" class="btn-primary">
                    Crear categoría
                </button>
            </form>
        </div>
    </div>
</template>
