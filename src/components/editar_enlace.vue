<script>
import { emitter } from '@/eventBus';

import localforage from 'localforage';
export default { 

    props:['datos_enlace'],
    mounted(){
        this.consultar_categorias();
    },
    data(){
        return{
            categorias_list:[],
            enlace:{
                enlace_url:this.datos_enlace.enlace_url,
                nombre:this.datos_enlace.nombre,
                descripcion:this.datos_enlace.descripcion,
                categoria:this.datos_enlace.categoria,
                origen:''
            }
        }
    },
    methods:{
        cerrar_editar_enlace(){
            emitter.emit('cerrar_editar_enlaces')
        },

        guardarEnlaceEditado(){
            let nuevoListado =[]
            //validar el origen de url en caso de cambio
            if (this.enlace.enlace_url != this.datos_enlace.enlace_url) {
                this.enlace.origen= this.determinar_origen(this.enlace.enlace_url);
            }else{
                this.enlace.origen= this.datos_enlace.origen;
            }
            
            //validar que los nuevos datos del enlace editado no sean los mismo de uno existente
            localforage.getItem('token_enlace')
            .then(listEnlaces => {
           
                //actualizar el registro con los cambios del enlace
                nuevoListado = JSON.parse(listEnlaces).filter(element => {
                return element.enlace_url !== this.datos_enlace.enlace_url
                    && element.nombre !== this.datos_enlace.nombre;
                });
                // Asignar el elemento editado al nuevo listado
                nuevoListado.unshift(this.enlace);
                console.log(nuevoListado);

                // Guardar la nueva lista de enlaces
                localforage.setItem("token_enlace", JSON.stringify(nuevoListado))
                .then(() => {
                    alert('Se guardó el listado con el enlace editado');
                })
                .catch((err) => {
                    console.error(err);
                });
            })
            .catch(err=>{
                console.error('error obteniendo el listado',err)
            })

            .finally( () => {
                this.cerrar_editar_enlace()
            });


        },

        determinar_origen(url){
            // Expresiones regulares para verificar el origen de la URL
            const patrones = {
                facebook: /(?:https?:\/\/)?(?:www\.)?facebook\.(com|es)/,
                instagram: /(?:https?:\/\/)?(?:www\.)?instagram\.(com|es)/,
                tiktok: /(?:https?:\/\/)?(?:www\.)?tiktok\.(com|es)/,
                youtube: /(?:https?:\/\/)?(?:www\.)?youtube\.(com|es)/,
                pinterest: /(?:https?:\/\/)?(?:www\.)?pinterest\.(com|es)/,
            };

            // Verificar si la URL coincide con algún patrón
            for (const origen in patrones) {
                if (patrones[origen].test(url)) {
                return origen;
                }
            }

            // Si no coincide con ninguno de los patrones, asignar "global" por defecto
            return "global";
        },
        consultar_categorias(){
            localforage.getItem("token_categoria")
                .then((datos)=>{
                    this.categorias_list=JSON.parse(datos);
                })
                .catch((err)=>{
                    console.error(err)
                })
                .finally(()=>{
                    
                })
                
        }
    } 
}
</script>

<template>
    <div class="body  fixed w-[100%] h-[100vh] z-30 bg-[#27293379]">
         <div class="w-[100%] p-2 pt-[15px] mt-[10vh] bg-[#164773] h-[90vh]">
             <header class="flex flex-row border-b-2 mb-[20px] p-2 border-b-[#C9C9C9] w-full h-[60px]">
                 <img @click="cerrar_editar_enlace()"  class="order-1 w-[30px] h-[30px]" src="/cerrar.png" alt="">
                 <h3 class="order-2 text-[1.5rem] ml-[60px] text-white -mt-[3px]">Editar enlace</h3>
             </header>
             <form @submit.prevent="guardarEnlaceEditado()"  class=" p-2 w-full h-full " action="">
                 <div class="w-full flex-col flex mb-[20px]">
                     <label class="mb-[5px] text-[#ABABAB] order-1"> Ruta del enlace</label>
                     <input v-model="enlace.enlace_url" required class="order-2 w-[100%] outline-none box-border pl-[10px] h-[50px]  rounded bg-[#033057] text-white  " type="url" name="" >
                 </div>
 
                 <div class="w-full flex-col flex mb-[20px]">
                     <label class="mb-[5px] text-[#ABABAB] order-1">Nombre del enlace</label>
                     <input  v-model="enlace.nombre" maxlength="65" required class="order-2 w-[100%] outline-none box-border pl-[10px] h-[50px]  rounded bg-[#033057] text-white  " type="text"  >
                 </div>
 
                 <div class="w-full flex-col flex mb-[20px]">
                     <label class="mb-[5px] text-[#ABABAB] order-1">Categoria</label>
                     <select  v-model="enlace.categoria" required class="order-2 w-[100%] outline-none box-border pl-[10px] h-[50px]  rounded bg-[#033057] text-white ">
                         <option value=""></option>
                         <option class="text-white "
                            v-for="(categorias,index) in this.categorias_list" 
                            :key="index" 
                            :value="categorias">
                            {{ categorias }}
                        </option>
                     </select>
                 </div>
 
                 <div class="w-full flex-col flex mb-[20px]">
                     <label class="mb-[5px] text-[#ABABAB] order-1">Description del enlace - optional</label>
                     <textarea v-model="enlace.descripcion" maxlength="640" class="order-2 w-[100%] resize-none outline-none box-border pl-[10px] h-[80px]  rounded bg-[#033057] text-white " name="" id="" cols="30" rows="15"></textarea>
                 </div>
 
                 <button  class="w-full h-[90px] bg-[#012340] shadow-lg rounded text-center text-white">
                     <span class="text-[1.5rem]">Guardar cambios</span>
                 </button>
                 
                
             </form>
         </div>
     </div>
 </template>
 
 <style scoped>
 .body{
     backdrop-filter: blur(2px);
 }
 </style>