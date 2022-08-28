import { AWSCloud } from "./providers/aws/awsProvider";
import { AzureCloud } from "./providers/azure/azureProvider";
import { GoogleCloud } from "./providers/gcloud/gCloudProvider";
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
    constructor(provider:CloudProvider, config:any){
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

    async streams(group:string):Promise<any[]>{
        const streams = await this.provider.listStreams(group) as []
        return streams
    }
}
