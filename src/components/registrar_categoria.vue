<script>
import { emitter } from '@/eventBus';
import localforage from 'localforage';
import { info } from 'autoprefixer';

export default {
    data(){
        return{
            nombre_categoria:''
            
        } //ffffr 
    }, 
methods:{
    cerrar_registro_categoria(){
        emitter.emit('cerrar_registro_categoria')
    },
    registrar_categoria(){
        
        //comprovar que el valor no se registre vacio
            if (this.nombre_categoria === '') {
                    //alertar al usuario de que se introdujo una categoria sin valor
            }else{
                localforage.getItem('token_categoria')
                .then(datosAlmacenados => {
                    if (datosAlmacenados !== null) {
                        let listado_categoria = JSON.parse(datosAlmacenados);

                        if (listado_categoria.includes(this.nombre_categoria)) {
                        console.log("El elemento ya se ha registrado");
                        } else {
                        // Agregar la nueva categoría al array
                        listado_categoria.unshift(this.nombre_categoria);
                        return localforage.setItem('token_categoria', JSON.stringify(listado_categoria));
                        }
                    } else {
                        // Si no hay datos almacenados, crear un nuevo array con la categoría
                        let nuevo_listado_categoria = [this.nombre_categoria];
                        return localforage.setItem('token_categoria', JSON.stringify(nuevo_listado_categoria));
                    }
                    })
                .then(() => {
                    //enviar el listado para ser renderizado 
                    this.cerrar_registro_categoria()
                console.log('Datos almacenados correctamente.')
                })
                .catch(error => {
                console.error('Error al almacenar/recuperar datos:', error)
                })
            
        }
       
    }
} 
}
</script>

<template>
    <div class="body  fixed w-[100%] h-[100vh] z-20 bg-[#27293379]">
        <div class="w-[100%] p-2 pt-[15px] mt-[50vh] bg-[#164773] h-[50vh]">
            <header class="flex flex-row border-b-2 mb-[20px] p-2 border-b-[#C9C9C9] w-full h-[60px]">
                <img @click="cerrar_registro_categoria"  class="order-1 w-[30px] h-[30px]" src="/cerrar.png" alt="">
                <h3 class="order-2 text-[1.5rem] ml-[60px] text-white -mt-[3px]">Registrar categoria</h3>
            </header>
            <form @submit.prevent="registrar_categoria" class=" p-2 w-full h-full " >
                <div class="w-full flex-col flex mb-[20px]">
                    <label class="mb-[5px] text-[#ABABAB] order-1">Nombre de la categoria</label>
                    <input v-model="nombre_categoria" maxlength="35" required class="order-2 w-[100%] text-white outline-none box-border pl-[10px] h-[50px]  mb-[10px] rounded bg-[#033057]  " type="text" name="" >
                </div>

                <button  class="w-full h-[80px] bg-[#012340] shadow-lg rounded text-center text-white">
                    <span class="text-[1.5rem]">Guardar</span>
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