import { ICloudClient } from "../specs";

export namespace GoogleCloud{    
    export class GoogleCloudClient implements ICloudClient{
        
        constructor(){ }

        async listGroups(prefix:string = ''):Promise<any[]>{
            return []
        }
        async listStreams(prefix:string = ''):Promise<any[]>{
            return []
        }
    }
}