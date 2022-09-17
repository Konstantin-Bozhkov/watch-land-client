import { AWSCloud } from "./providers/aws/awsProvider";
import { AzureCloud } from "./providers/azure/azureProvider";
import { GoogleCloud } from "./providers/gcloud/gCloudProvider";
import { IAwsConfig, ILogsFilter } from "./providers/specs";
import { CloudProvider } from "./specs";

class WatchLand{

    // Available Cloud providers
    private providers = {
        [CloudProvider.AWS] : AWSCloud.AwsClient,
        [CloudProvider.Azure] : AzureCloud.AzureClient,
        [CloudProvider.gCloud] : GoogleCloud.GoogleCloudClient
    };

    // Cloud provider to be in use 
    private provider:AWSCloud.AwsClient|AzureCloud.AzureClient|GoogleCloud.GoogleCloudClient

    /**
     * 
     * @param provider Cloud provider to use AWS, Azure or Google Cloud
     * @param config Configuration options for the cloud provider
     */
    constructor(provider:CloudProvider.AWS, config:IAwsConfig){
        this.provider = new this.providers[provider](config);
    }

    /** 
     * @param limit 
     * 
     * Returns all log groups
     */
    async groups(limit:number = 25):Promise<any[]>{
        const groups = await this.provider.listGroups() as []
        return groups
    }

    /**
     * 
     * @param group Group name
     * @returns 
     */
    async streams(group:string):Promise<any[]>{
        const streams = await this.provider.listStreams(group) as []
        return streams
    }
    
    
    /**
     * 
     * @param group Group name
     * @param stream Stream name
     */
     async *logs(group:string, streams:string[], filters?:ILogsFilter):any{
        yield* this.provider.listLogEvents(group, streams, { ...filters })
    }
}


const config:IAwsConfig = { 
    credentials:{
        profile:'kos'
    },
    options:{         
        region:'eu-west-1' 
    }
}

const client = new WatchLand(CloudProvider.AWS, config)
