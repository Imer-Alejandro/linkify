<script>
import { emitter } from '@/eventBus'
export default {
    props:['datosEnlace'],
    mounted(){

    },
    
    methods:{
        abrir_detalles(){
            emitter.emit('abrir_detalles_enlace',this.datosEnlace)
        },
        clipboardText(texto) {
      // Intenta acceder al portapapeles usando la API Clipboard
        navigator.clipboard.writeText(texto)
            .then(() => {
            alert("Texto copiado al portapapeles:", texto);
            })
            .catch((err) => {
            console.error("Error al copiar al portapapeles:", err);
            });
    }   ,
    }
}
</script>
<template>
    <div class="bg-[#012340] w-[95%] p-2 flex flex-row h-[100px] shadow-lg mb-[30px] relative rounded">
        <!-- este div es el que se va encargar de detectar la interacion escluyendo el btn de la ruta -->
        <div ondblclick="clipboardText(datosEnlace.enlace_url)" @click="abrir_detalles()"  class="order-1 flex">

            <div class=" h-full border-r-2 mr-[10px] items-center justify-center flex p-3 order-1">
                <div v-if="datosEnlace.origen == 'facebook'">
                    <img class="w-[40px] h-[40px]" src="/facebook_1.png" alt="">
                </div>
                <div v-else-if="datosEnlace.origen == 'instagram'">
                    <img class="w-[40px] h-[40px]" src="/instagram_1.png" alt="">
                </div>
                <div v-else-if="datosEnlace.origen == 'tiktok'">
                    <img class="w-[40px] h-[40px]" src="/tik-tok.png" alt="">
                </div>
                <div v-else-if="datosEnlace.origen == 'youtube'">
                    <img class="w-[40px] h-[40px]" src="/youtube.png" alt="">
                </div>
                <div v-else-if="datosEnlace.origen == 'pinterest'">
                    <img class="w-[40px] h-[40px]" src="/pinterest.png" alt="">
                </div>
                <div v-else>
                    <img class="w-[40px] h-[40px]" src="/red-mundial.png" alt="">
                </div>
            </div>
            <div class="order-3 w-[250px] h-full overflow-hidden pt-[10px]   ">
                <h3 class="text-[#ffffff] text-[1.2rem] mb-[5px]  select-none">{{datosEnlace.nombre}}</h3>
                <p v-if="datosEnlace.descripcion != ''" class="font-light text-[0.7rem] w-[80%] text-[#b6b6b6] select-none">
                    {{ datosEnlace.descripcion }}
                </p>
                <p v-else class="font-light text-[0.7rem] w-[80%] text-[#b6b6b6] select-none">
                    enlace sin descripcion...
                </p>
            </div>

        </div>
         
        <a target="_blank" :href="datosEnlace.enlace_url" >
        <button class="order-2 absolute mt-[15px] bg-[#033057] border-1 ml-[90%]  shadow-lg flex text-center 
        items-center justify-center w-[50px] h-[50px] rounded-[100%]">
            <img class="w-[40px] h-[40px] ml-[3px]" src="/proximo.png" alt="">
        </button>
        </a>

    </div>
</template>