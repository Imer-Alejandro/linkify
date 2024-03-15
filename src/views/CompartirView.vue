<script>
import router from '@/router';
import localforage from 'localforage'

export default {
    props: ['url',"title", "text"],
    mounted(){
        this.consultar_categorias();
        alert("enlace: " + this.url)
        alert("titulo: " + this.title)
        alert("texto: " + this.text)
        this.validarUrl(this.title,this.url,this.text);
  
    },
    data(){
        return{
            categorias_list:[],
            enlace:{
                enlace_url:"",
                nombre:"",
                descripcion:'',
                categoria:'',
                origen:''
            }
        }
    },
    methods:{
        regresar_inicio(){
            this.$router.push('/');
        },
        validarUrl(title, url, text){
            // Expresión regular para detectar URLs
            const regex = /(?:https?:\/\/)?([^\s]+)/g;

            let urlExtraida = '';

            // Verificar si el título contiene una URL
            if (title && regex.test(title)) {
                urlExtraida = title.match(regex)[0];
            }

            // Si el título no contiene una URL, verificar el texto
            if (!urlExtraida && text && regex.test(text)) {
                urlExtraida = text.match(regex)[0];
            }
            // Si aún no se ha extraído la URL, usar el parámetro "url"
            if (!urlExtraida && url) {
                urlExtraida = url;
            }

            this.enlace.enlace_url=urlExtraida;


        },
        registrar_enlace() {
  if (this.enlace.categoria === '') {
    alert("Debe indicar una categoría");
  } else {
    localforage.getItem('token_enlace')
      .then(datosAlmacenados => {
        if (datosAlmacenados !== null) {
            let listado_enlaces =JSON.parse(datosAlmacenados) ;

            // Validar si existen enlaces con el mismo nombre o URL
            const enlaceExistente = listado_enlaces.find(element =>
            element.nombre === this.enlace.nombre || element.enlace_url === this.enlace.enlace_url
            );

            if (enlaceExistente) {
            console.log("Ya existe un enlace con el mismo nombre o URL.");
            } else {
            //asignarle el origen
            this.enlace.origen=this.determinar_origen(this.enlace.enlace_url);
            // Agregar el nuevo enlace al principio del array
            listado_enlaces.unshift(this.enlace);

            // Almacenar el nuevo array en LocalForage
            return localforage.setItem('token_enlace', JSON.stringify(listado_enlaces));
            }
        }else{
            // Si no hay datos almacenados, crear un nuevo array con la categoría
            let nuevo_listado_enlace = [this.enlace];
            return localforage.setItem('token_enlace', JSON.stringify(nuevo_listado_enlace));
        }
        
      })
      .then(() => {
        this.regresar_inicio();
      })
      .catch(error => {
        console.error('Error al almacenar/recuperar datos:', error);
      });
  }
},
        
        determinar_origen(url){
            // Expresiones regulares para verificar el origen de la URL
            const patrones = {
                facebook: /(?:https?:\/\/)?(?:www\.)?facebook\.(com|es)/,
                instagram: /(?:https?:\/\/)?(?:www\.)?instagram\.(com|es)/,
                tiktok: /(?:https?:\/\/)?(?:www\.)?tiktok\.(com|es)/,
                youtube: /(?:https?:\/\/)?(?:www\.)?(youtube|youtu)\.(com|es|be)/,
                pinterest: /(?:https?:\/\/)?(?:www\.)?(pinterest|pin)\.(com|es|it)/,
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
                    console.log(this.categorias_list)
                })
                .catch((err)=>{
                    console.error("error en la categoria"+err)
                })

                
        }
        
    }
}
</script>
<template>
    <div class="body  fixed w-[100%] h-[100vh] z-20 bg-[#27293379]">
         <div class="w-[100%] p-2 pt-[15px]  bg-[#164773] h-[100vh]">
             <header class="flex flex-row border-b-[1px] mb-[20px] p-2 border-b-[#C9C9C9] w-full h-[60px]">
                 <img @click="regresar_inicio()" class="order-1 w-[30px] h-[30px]" src="/cerrar.png" alt="">
                 <h3 class="order-2 text-[1.5rem] text-white ml-[70px] -mt-[3px]">Registrar enlace</h3>
             </header>
             <form class=" p-2 w-full h-full " @submit.prevent="registrar_enlace()" >
                 <div class="w-full flex-col flex mb-[20px]">
                     <label class="mb-[5px] text-[#ABABAB] order-1"> Ruta del enlace</label>
                     <input v-model="enlace.enlace_url"  required class="order-2 text-white  w-[100%] outline-none box-border pl-[10px] h-[50px]  rounded bg-[#033057]  " type="url" name="" >
                 </div>
 
                 <div class="w-full flex-col flex mb-[20px]">
                     <label class="mb-[5px] text-[#ABABAB] order-1">Nombre del enlace</label>
                     <input  v-model="enlace.nombre" maxlength="65" required class="order-2 text-white  w-[100%] outline-none box-border pl-[10px] h-[50px]  rounded bg-[#033057]  " type="text" name="" >
                 </div>
 
                 <div class="w-full flex-col flex mb-[20px]">
                    <label class="mb-[5px] text-[#ABABAB] order-1">Categoria</label>
                    <select v-model="enlace.categoria"  class="order-2 w-[100%] text-white outline-none box-border pl-[10px] h-[50px]  rounded bg-[#033057]  " name="" id="">
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
                     <textarea v-model="enlace.descripcion" maxlength="640" class="order-2 w-[100%] pt-[5px] resize-none outline-none box-border pl-[10px] h-[80px] text-white rounded bg-[#033057] " name="" id="" cols="30" rows="15"></textarea>
                 </div>
 
                 <button  class="w-full mt-[20px] h-[80px] bg-[#012340] shadow-lg rounded text-center text-white">
                     <span class="text-[1.3rem]">Guardar</span>
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