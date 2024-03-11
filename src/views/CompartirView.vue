<template>
    <div class="body  fixed w-[100%] h-[100vh] z-20 bg-[#27293379]">
         <div class="w-[100%] p-2 pt-[15px]  bg-[#164773] h-[100vh]">
             <header class="flex flex-row border-b-[1px] mb-[20px] p-2 border-b-[#C9C9C9] w-full h-[60px]">
                 <img  class="order-1 w-[30px] h-[30px]" src="/cerrar.png" alt="">
                 <h3 class="order-2 text-[1.5rem] text-white ml-[70px] -mt-[3px]">Registrar enlace</h3>
             </header>
             <form class=" p-2 w-full h-full "  >
                 <div class="w-full flex-col flex mb-[20px]">
                     <label class="mb-[5px] text-[#ABABAB] order-1"> Ruta del enlace</label>
                     <input  required class="order-2 text-white  w-[100%] outline-none box-border pl-[10px] h-[50px]  rounded bg-[#033057]  " type="url" name="" >
                 </div>
 
                 <div class="w-full flex-col flex mb-[20px]">
                     <label class="mb-[5px] text-[#ABABAB] order-1">Nombre del enlace</label>
                     <input  maxlength="65" required class="order-2 text-white  w-[100%] outline-none box-border pl-[10px] h-[50px]  rounded bg-[#033057]  " type="text" name="" >
                 </div>
 
                 <div class="w-full flex-col flex mb-[20px]">
                     <label class="mb-[5px] text-[#ABABAB] order-1">Categoria</label>
                     <select  class="order-2 w-[100%] text-white outline-none box-border pl-[10px] h-[50px]  rounded bg-[#033057]  " name="" id="">
                         <option value=""></option>
                         <!-- <option class="text-white "
                             v-for="(categorias,index) in this.categorias_list" 
                             :key="index" 
                             :value="categorias">
                             {{ categorias }}
                         </option> -->
                     </select>
                 </div>
 
                 <div class="w-full flex-col flex mb-[20px]">
                     <label class="mb-[5px] text-[#ABABAB] order-1">Description del enlace - optional</label>
                     <textarea  maxlength="640" class="order-2 w-[100%] pt-[5px] resize-none outline-none box-border pl-[10px] h-[80px] text-white rounded bg-[#033057] " name="" id="" cols="30" rows="15"></textarea>
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