import { ICloudClient } from "../specs";

export namespace GoogleCloud{    
    export class GoogleCloudClient implements ICloudClient{
        
        constructor(){ }

        async listGroups(limit:number, next:string = ''):Promise<any[]>{
            return []
        }
    }
}