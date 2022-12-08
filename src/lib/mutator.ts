import { Watch } from "./watch";

/**
 * 
 * @param watch 
 * @param generator 
 * @param rate 
 * @returns 
 * Mutates a given Watch instance based on data from a generator with a given rate
 * to prevent throthling. Once ready the mutator will resolve the Watch instance 
 */
 export const mutator = (watch:Watch, generator:AsyncGenerator, rate:number):NodeJS.Timer=>{
    const mutator:NodeJS.Timer = setInterval(async ()=>{
        const data = await generator.next().catch((error)=>{
            watch.resolveException(error)
        })
        /**
         * in case of error abort the mutator execution
         */
        if(!data) return
        if(data.value != undefined && data.value.length > 0){
            watch.resolve(data.value);
        }
        if(data.done === true){
            clearInterval(mutator)
            watch.complete()
        }
    }, rate) 
    return mutator
}