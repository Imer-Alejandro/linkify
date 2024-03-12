<script>
import registrar_enlaces from "@/components/registar_enlace.vue"
import registrar_categoria from "@/components/registrar_categoria.vue"
import eliminar_categoria from "@/components/eliminar_categoria.vue"
import eliminar_enlaces from "@/components/eliminar_enlaces.vue"
import detalles_enlace from "@/components/detalles_enlace.vue"
import editar_enlace from "@/components/editar_enlace.vue"
import busqueda_enlace from "@/components/busqueda_enlace.vue"
import card_enlace from "@/components/card_enlace.vue"


import { emitter } from '@/eventBus';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import localforage from 'localforage'


export default {
  mounted(){
   
    //obtener categorias
    this.obtener_categoria();

    //obtener enlaces
    this.obtener_enlaces();

    //vista eliminar enlace
    emitter.on('abrir_eliminar_enlace',(data)=>{
      this.mostrarEliminarEnlace=true
      this.datos_enlace_acion= data
    })
    emitter.on('cerrar_eliminar_enlace',()=>{
      this.mostrarEliminarEnlace=false;
      this.obtener_enlaces()
      this.mostrarDetalleEnlace = false;

    })
    //funcion para abrir la edicion de enlace
    emitter.on('abrir_editar_enlace',(data)=>{
        this.mostrarEditarEnlace=true
        this.datos_enlace_acion= data
    })
    emitter.on('cerrar_editar_enlaces',()=>{
      this.obtener_enlaces()
      this.mostrarEditarEnlace=false
      this.mostrarDetalleEnlace = false;
    })

    //ventana de registro de enlaces
    emitter.on('cerrar_registro_enlace',()=>{
      this.obtener_enlaces()
      this.mostrarRegistrarEnlace=false
    })
 
    //ventana categoria
    emitter.on('cerrar_registro_categoria',()=>{
      localforage.getItem('token_categoria')
      .then((listado)=>{
        this.categorias=JSON.parse(listado)
      })
      .catch((err)=>{
        console.error(err)
      })
      
      
      this.mostrarRegistrarCategoria=false
    })

    emitter.on('abrir_eliminar_categoria',(indice)=>{
      this.id_categoria=indice;
      this.mostrarEliminarCategoria=true
    })
    //ventana eliminar categoria
    emitter.on('cerrar_eliminar_categoria',()=>{
      localforage.getItem('token_categoria')
      .then((listado)=>{
        this.categorias=JSON.parse(listado)
      })
      .catch((err)=>{
        console.error(err)
      })
      this.filtar_elementos = '- todos'
      this.mostrarEliminarCategoria=false
    })

    //ventana busquedad
    emitter.on('cerrar_busqueda_enlace',()=>{
      this.mostrarBusquedaEnlace=false
      this.data_busqueda=''
    })

    //ventana detalles
    emitter.on('cerrar_detalles_enlace',()=>{
      this.mostrarDetalleEnlace = false;
    })

    emitter.on('abrir_detalles_enlace',(data)=>{
      this.mostrarDetalleEnlace = true
      this.datos_enlace_acion= data
    })
  },
  components:{
    "registrar-enlace":registrar_enlaces,
    "registrar-categoria":registrar_categoria,
    "eliminar-categoria":eliminar_categoria,
    "eliminar-enlace":eliminar_enlaces,
    "detalle-enlace":detalles_enlace,
    "editar-enlace":editar_enlace,
    "buscar-enlace":busqueda_enlace,
    "enlaces":card_enlace

  },
  data(){
    return{
      datos_enlace_acion:'',
      id_categoria:'',
      enlaces:[],
      categorias:[],

      data_busqueda:'',
      indicador_categoria:'',
      filtar_elementos:'',

      mostrarRegistrarEnlace:false,
      mostrarRegistrarCategoria:false,
      mostrarDetalleEnlace:false,
      mostrarEditarEnlace:false,
      mostrarBusquedaEnlace:false,
      mostrarCompartirEnlace:false,
      mostrarEliminarCategoria:false,
      mostrarEliminarEnlace:false
    }
  },
  watch:{
    filtar_elementos(){
      if (this.filtar_elementos == '- todos') {
        this.obtener_enlaces();
      }else{
        localforage.getItem("token_enlace")
        .then(listado_categoria=>{
          if (listado_categoria !== null) {
            this.enlaces=JSON.parse(listado_categoria).filter(element=>{
              return element.categoria ===  this.filtar_elementos;
            })
          }
        })
        .catch(err=>console.error(err));
      }
      this.indicador_categoria= `- ${this.filtar_elementos}`;
    }
  },
  methods:{
    abrir_registro_enlaces(){
      this.mostrarRegistrarEnlace = true;
    },
    abrir_registro_categoria(){
      this.mostrarRegistrarCategoria = true;
    },
    // indicar_categoria_enlaces(categoria){
    //   this.indicador_categoria = categoria;
    //   //cargar los enlaces de la categoria para ver los resultados
      

    // },
    abrir_eliminar_categoria(indice){   
      emitter.emit('abrir_eliminar_categoria', indice);  
    },
    
    buscar_enlace(){
      this.mostrarBusquedaEnlace=true
    }, 
    
    obtener_categoria(){
      localforage.getItem('token_categoria')
      .then(datos=>{
        this.indicador_categoria=" - todos"
        this.categorias=JSON.parse(datos)

      })
      .catch(err=>{
        console.error(err)
      })

    },

    obtener_enlaces(){
      localforage.getItem('token_enlace')
      .then(datos=>{

        this.enlaces=JSON.parse(datos)
        this.indicador_categoria=' - todos'
      })
      .catch(err=>{
        console.error(err)
      })
    },
    handleBeforeInstallPrompt(event) {
    // Mostrar el mensaje de instalación
    event.preventDefault(); // Evitar que se muestre automáticamente
    this.$nextTick(() => {
      this.showInstallPrompt(event);
    });
  }, showInstallPrompt(event) {
    // Puedes personalizar el mensaje según tus necesidades
    const installPrompt = confirm('¿Quieres instalar esta aplicación en tu dispositivo?');

    if (installPrompt) {
      // Mostrar el banner de instalación
      event.prompt();
      // Capturar el resultado de la instalación
      event.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          console.log('El usuario aceptó instalar la aplicación');
        } else {
          console.log('El usuario rechazó la instalación de la aplicación');
        }
      });
    
      // Evento para manejar la instalación después de que el usuario acepta
      window.addEventListener('appinstalled', (event) => {
        console.log('La aplicación se ha instalado con éxito');
      });


    }
  },
  },
}
</script>
 
<template>
  <div class="bg-[#164773] w-full h-[100%] box-border pb-[500px]">

    <registrar-enlace v-if="mostrarRegistrarEnlace"/>

    <editar-enlace :datos_enlace="datos_enlace_acion" v-if="mostrarEditarEnlace"/>

    <registrar-categoria v-if="mostrarRegistrarCategoria"/>

    <eliminar-categoria :id_categoria="id_categoria" v-show="mostrarEliminarCategoria"/>

    <eliminar-enlace :datos_enlace="datos_enlace_acion" v-if="mostrarEliminarEnlace"/>
 
    <buscar-enlace :dato_busqueda="data_busqueda" v-if="mostrarBusquedaEnlace"/>

    <detalle-enlace :datos_enlace="datos_enlace_acion" v-if="mostrarDetalleEnlace"/>

    <!-- boton para abrir el registro de enlace -->

    <div @click="abrir_registro_enlaces()" class="w-full z-10 fixed mt-[85vh] flex justify-center items-center p-2">
      <button class="bg-[#033057] shadow-xl    h-[80px] w-[80px] rounded-[100%] flex justify-center items-center ">
        <img class="w-[45px] h-[45px]" src="/anadir-enlace.png">
      </button>
    </div>

    <header class="bg-[#012340] mb-[20px] justify-center items-center p-2 box-border w-full  pt-[15px] h-[200px]">
      <div class="w-full flex flex-row">
        <h1 class="order-1 text-[1.5rem] text-white">Linkify</h1>
        
      </div> 
      <!-- formulario de busqueda -->
      <div class="mt-[10px] w-full mb-[10px] ">
        <form @submit.prevent="buscar_enlace()">
          <input style="color: white;" required v-model="data_busqueda" class=" w-[100%] h-[50px] box-border text-white pl-[10px] outline-none bg-[#033057] focus:bg-[#033057]  placeholder:text-[0.9rem] placeholder:text-[#D7D7D7]" type="text" placeholder="Buscar enlace por nombre..." id="busqueda_enlaces">
          <button type="submit"  class="h-[50px]  w-[50px] flex items-center justify-center absolute -mt-[50px] ml-[83%]">
            <img class="w-[30px] h-[30px]" src="/buscar.png" alt="">
          </button>
        </form>
          
        
      </div>
      
      <div class="w-full h-[70px]  overflow-x-scroll box-border p-1 ">
        <div class="h-full flex flex-row items-center pr-[15px]">

          <button @click="abrir_registro_categoria()" class=" btn-categoria inline-block
           select-none   p-2 focus:text-white focus:border-b-white focus:border-b-2 w-auto  h-[35px] text-center outline-none items-center mr-4 ">
            <div class="flex flex-row bg-red w-full h-full items-center focus:text-white ">
              <img class="w-[20px] h-[20px] mt-[3px]  order-1" src="/anadir.png" alt="">
              
              <h3 class="text-[#C9C9C9] order-2 ml-[10px] text-[1rem]">crear categoria</h3>
            </div>
          </button>

          <button @click="filtar_elementos = '- todos'" class=" btn-categoria inline-block
           select-none  p-2 focus:text-white focus:border-b-white focus:border-b-2 w-auto  h-[35px] text-center outline-none items-center mr-4 ">
            <div class="  flex flex-row bg-red w-full h-full text-center items-center focus:text-white ">
              <h3 class="text-[#8B8B8B] order-2  text-[1rem]">todos</h3>
            </div>
          </button>

          
          <button 
            v-for="(categorias,index) in this.categorias"  
            :key="index"
            @click="filtar_elementos=`${categorias}`"   
            class=" btn-categoria relative select-none p-2 focus:text-white focus:border-b-white focus:border-b-2 w-auto  h-[35px] text-center outline-none items-center mr-4 ">
              <img @click="abrir_eliminar_categoria(categorias)" class=" eliminar_cat w-[20px] h-[20px]  absolute -mt-[20px] ml-[90%]" src="/eliminar_categoria.png" >
            <div class="flex flex-row bg-red w-full h-full text-center items-center focus:text-white ">
              <h3 class="text-[#8B8B8B] order-2  text-[1rem]">{{categorias}} </h3>
            </div>
          </button>

        </div>
      </div>
     
    </header>

    <section class="p-2 w-full mb-[100px]"> 
      <h2 class="text-[1.5rem] text-white mb-[30px]">Categoria <span class="text-[1.1rem] text-gray-300">{{indicador_categoria}}</span></h2>

    <div class="p-t-[10px]">
      <!-- <div v-if="this.enlaces.length >0"> -->
        <div v-for="(card_enlace,index) in enlaces" :key="index">
          <enlaces :datosEnlace="card_enlace"/>
        </div>
      <!-- </div>
      <div class="w-full flex text-center items-center justify-center" v-else>
        <h3 class="text-[#C4C4C4] ">No se encontro enlaces...</h3>
      </div> -->
    </div>
        
  </section>
    
  </div>
</template>

<style scoped>



.btn-categoria{
  flex: 0 0 auto; 
}

.btn-categoria:focus > div h3{
  color: rgb(255, 255, 255);
}

.btn-categoria  .eliminar_cat{
  display: none;
}
.btn-categoria:focus > .eliminar_cat{
  display: block;
}
.toggle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  cursor: pointer;
  line-height: 1;
}

.input {
  display: none;
}

.icon {
  grid-column: 1 / 1;
  grid-row: 1 / 1;
  transition: transform 500ms;
}

.icon--moon {
  transition-delay: 200ms;
}

.icon--sun {
  transform: scale(0);
}

#switch:checked + .icon--moon {
  transform: rotate(360deg) scale(0);
}

#switch:checked ~ .icon--sun {
  transition-delay: 200ms;
  transform: scale(1) rotate(360deg);
}
</style>