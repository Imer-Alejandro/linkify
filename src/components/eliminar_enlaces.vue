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
    <div class="body  fixed w-[100%] h-[100vh] z-30 bg-[#27293379]">
        <div class="w-[90%] p-2 ml-[5%] mr-[5%] rounded-[2%] pt-[15px] mt-[30vh] bg-[#164773] h-[40vh]">
            <header class="flex flex-row  border-b-2 mb-[30px] p-2 border-b-[#C9C9C9] w-full h-[60px]">
                <img @click="cerrar_eliminar_enlace" class="order-1 w-[30px] h-[30px]" src="/cerrar.png" alt="">
                <h3 class="order-2 text-[1.5rem] ml-[45px] text-white -mt-[3px]">Eliminar enlace</h3>
            </header>
            <div class="flex  flex-col items-center">
                <h3 class="text-center mb-[30px] text-[#ABABAB]">esta seguro que desea eliminar el registro del enlaces ?</h3>
                <button @click="eliminar_enlace()" class="w-[95%]  h-[60px] text-center text-white text-[1.3rem] rounded bg-[#DB3838]">
                    eliminar
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.body{
    backdrop-filter: blur(2px);
}
</style>