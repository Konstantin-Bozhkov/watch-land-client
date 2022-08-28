import { ICloudClient } from "../specs";

export namespace AzureCloud{
    
    export class AzureClient implements ICloudClient{
        
        constructor(){ }

        async listGroups(limit:number, next:string = ''):Promise<any[]>{
            return []
        }
    }
}