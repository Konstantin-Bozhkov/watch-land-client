import { ICloudClient } from "../specs";

export namespace AzureCloud{
    
    export class AzureClient implements ICloudClient{
        
        constructor(){ }

        async listGroups(prefix:string = ''):Promise<any[]>{
            return []
        }
        async listStreams(prefix:string = ''):Promise<any[]>{
            return []
        }
    }
}