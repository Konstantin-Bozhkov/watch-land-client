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

    constructor(provider:CloudProvider){
        this.provider = new this.providers[provider]();
        
        this.provider.listLogGroups()

    }



}