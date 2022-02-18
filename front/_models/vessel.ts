export class Vessel {
   readonly id: number; 
   readonly value: string; 

   constructor(id: number, name:string){
       this.id = id;
       this.value = name;
   }

}