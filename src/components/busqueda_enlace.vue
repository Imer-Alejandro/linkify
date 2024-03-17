<script>
import card_enlace from "@/components/card_enlace.vue"
import { emitter } from '@/eventBus';
import localforage from 'localforage'

export default {
    props:['dato_busqueda'],
    mounted(){
        alert(this.dato_busqueda)
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
                        return element.nombre.toLowerCase().includes(this.dato_busqueda)
                    })
                }
            })
        }
    }
}
</script>
<template>
    <div class="body  fixed w-[100%] h-[100vh] z-20 bg-[#27293379]">
        <div class="w-[100%] p-2 pt-[15px] mt-[10vh] bg-[#164773] h-[90vh]">
            <header class="flex flex-row border-b-2 mb-[20px] p-2 border-b-[#C9C9C9] w-full h-[60px]">
                <img @click="cerrar_busqueda_enlace()" class="order-1 w-[30px] h-[30px]" src="/cerrar.png" alt="">
                <h3 class="order-2 text-[1.5rem] ml-[40px] text-white -mt-[3px]">Resultado de busqueda</h3>
            </header>
            <div>
                <h3 class="mb-[20px] text-[#C4C4C4]">Enlaces encontrados: <span class="bg-[#498AD4] p-1 rounded text-white">{{ listado_resultado.length }}</span></h3>
                <!-- CARGA DE LOS ENLACES -->
                <div class="w-full h-[500px] overflow-hidden overflow-y-scroll p-1 ">
                    <div v-if="listado_resultado.length > 0">
                        <div 
                        v-for="(enlace,index) in listado_resultado" :key="index">
                            <card-link :datosEnlace="enlace"/>
                        </div>
                    </div>
                    <div class="w-full flex text-center items-center justify-center" v-else>
                        <h3 class="text-[#C4C4C4] ">No se encontraron coincidencias...</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
.body{
    backdrop-filter: blur(2px);
}
</style>