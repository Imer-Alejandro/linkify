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
             // Verificar si el navegador soporta la API de Web Share
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
    <div class="body  fixed w-[100%] h-[100vh] z-20 bg-[#27293379]">
        <div class="w-[100%]   mt-[10vh] bg-[#012340] h-[90vh]">
            <div  class=" body w-[40px] shadow-lg absolute ml-[85%] mt-[15px] h-[40px] p-2 box-border rounded-[100%] flex justify-center items-center bg-[#bdbdbdb2]">
                <img @click="cerrar_detalles_enlace()" class="w-[20px] h-[20px]" src="/cerrar_1.png" alt="">
            </div>
            <header class="w-full bg-slate-700 h-[300px]">
                <img v-if="previewImage" class="w-full h-full" 
                :src="previewImage"
                alt="" srcset="">
            </header> 
                <div class="w-[80px] 80px p-2 box-border shadow-xl flex justify-center items-center rounded absolute -mt-[25px] bg-[#164773] ml-[8px]">
                    <div v-if="datos_enlace.origen == 'facebook'">
                        <img class="w-[45px] h-[45px]" src="/facebook_1.png" alt="">
                    </div>
                    <div v-else-if="datos_enlace.origen == 'instagram'">
                        <img class="w-[45px] h-[45px]" src="/instagram_1.png" alt="">
                    </div>
                    <div v-else-if="datos_enlace.origen == 'tiktok'">
                        <img class="w-[45px] h-[45px]" src="/tik-tok.png" alt="">
                    </div>
                    <div v-else-if="datos_enlace.origen == 'youtube'">
                        <img class="w-[45px] h-[45px]" src="/youtube.png" alt="">
                    </div>
                    <div v-else-if="datos_enlace.origen == 'pinterest'">
                        <img class="w-[45px] h-[45px]" src="/pinterest.png" alt="">
                    </div>
                    <div v-else>
                        <img class="w-[45px] h-[45px]" src="/red-mundial.png" alt="">
                    </div>
                </div>
            
            <div class="w-full pb-[15px]  ">
                <div class="w-full p-2 mt-[50px]">
                    <img @click="open_menu_plegable_and_close()" class="w-[40px] h-[40px] absolute -mt-[45px] ml-[85%]" src="/menu.png" alt="">
                    
                    <div v-show="visibilidad_menu_plegable" class="menu-plegable absolute bg-[#164773] shadow-lg ml-[47%] -mt-[20px] w-[140px] rounded h-[120px] overflow-hidden">
                        <ul class="w-full h-full flex flex-col">
                            <li  class="w-full  h-[50px] border-b-white border-b-[1px]" >
                                <button @click="abrir_editar_enlace()" class="w-full h-full text-white  flex items-center p-2">
                                    editar
                                </button>
                            </li>
                            <li class="w-full  h-[50px] border-b-white border-b-[1px]">
                                <button @click="compartir_enlace()" class="w-full h-full text-white flex items-center p-2">
                                    compartir
                                </button>
                            </li>
                            <li class="w-full  h-[50px] border-b-white border-b-[1px]">
                                <button @click="abrir_eliminar()" class="w-full h-full text-white flex items-center p-2">
                                    eliminar
                                </button>
                            </li>
                        </ul>
                    </div>
                    <h3 class="text-[1.3rem] text-white select-none">{{ datos_enlace.nombre }}</h3>     
                    <div class="mt-[20px]">
                        <h3 class="mb-[10px] text-[#ABABAB]">Categoria:</h3>
                        <span class="bg-[#164773] text-[#D8D8D8] w-auto rounded shadow-md p-2 select-none">{{ datos_enlace.categoria }}</span>
                    </div>    
                </div>
            </div>

            <div class="w-full bg-[#011526] p-2 mt-[10px]">
                <h3 class="mb-[5px] text-[#ABABAB]">Description:</h3>
                 <div class="w-full h-[130px] overflow-y-scroll overflow-hidden ">
                    <p class="text-[#c9c9c9] select-none">
                        {{datos_enlace.descripcion}}
                    </p>
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