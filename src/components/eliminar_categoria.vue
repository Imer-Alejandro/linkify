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
        console.log(nombreCategoria)
    localforage.getItem("token_categoria")
    .then(listado => {
      let listado_categoria = JSON.parse(listado) || [];
      
      // Utilizar el método filter para crear un nuevo array sin el elemento
      listado_categoria = listado_categoria.filter(item => item !== nombreCategoria);

      // Almacenar el nuevo array en LocalForage
      return localforage.setItem("token_categoria", JSON.stringify(listado_categoria));
    })
    .then(() => {
        //eliminar los enlaces de la categoria
        this.eliminar_enlaces_categoria(this.id_categoria);
        console.log(`Se eliminó la categoría "${nombreCategoria}" correctamente`);
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
            //guardar nuevo listado con las enlaces eliminados
            localforage.setItem("token_enlace",JSON.stringify(nuevoListadoEnlaces))
        })
        .catch(err=>{console.error(err)})
    }

   }
}
</script>
<template>
    <div class="body  fixed w-[100%] h-[100vh] z-20 bg-[#27293379]">
        <div class="w-[90%] p-2 ml-[5%] mr-[5%] rounded-[2%] pt-[15px] mt-[30vh] bg-[#164773] h-[40vh]">
            <header class="flex flex-row  border-b-2 mb-[30px] p-2 border-b-[#C9C9C9] w-full h-[50px]">
                <img @click="cerrar_eliminar_categoria" class="order-1 w-[30px] h-[30px]" src="/cerrar.png" alt="">
                <h3 class="order-2 text-[1.5rem] ml-[45px] text-white -mt-[3px]">Eliminar categoria</h3>
            </header>
            <div class="flex  flex-col items-center">
                <h3 class="text-center mb-[30px] text-[#ABABAB]">esta seguro que desea eliminar el registro de la categoria y los enlaces de esta ?</h3>
                <button @click="eliminar_categoria(this.id_categoria)" class="w-[95%]  h-[60px] text-center text-white text-[1.3rem] rounded bg-[#DB3838]">
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