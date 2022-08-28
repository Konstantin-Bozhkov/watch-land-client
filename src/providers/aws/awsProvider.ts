import * as AWS from 'aws-sdk';
import { IAwsConfig, ICloudClient } from '../specs';
export namespace AWSCloud{
    
    export class AwsClient implements ICloudClient{
        private cw:AWS.CloudWatchLogs;

        constructor(config:IAwsConfig){
            // AWS configuration options
            AWS.config.update(config.options as AWS.ConfigurationOptions);            
            if(config.credentials){
                const credentials = new AWS.SharedIniFileCredentials(config.credentials);
                AWS.config.update({credentials:credentials})
            }
            // Set up cloudwatch
            this.cw = new AWS.CloudWatchLogs()
        }

        async listGroups(limit:number, nextToken:string = ''):Promise<any[]>{
            let params:AWS.CloudWatchLogs.DescribeLogGroupsRequest = {
                "limit": limit              
            }
            // Add nextToken key to the params if supplied
            if(nextToken != '') params.nextToken = nextToken;

            let awslogGroups = await this.cw.describeLogGroups(params).promise()
            let keys = Object.keys(awslogGroups);  
            
            let groups:AWS.CloudWatchLogs.LogGroup[] = [].concat(awslogGroups.logGroups as []);
            
            // Keep calling list groups untill all groups are fetched
            if(keys.includes('nextToken')){
                groups = groups.concat( await this.listGroups(limit, awslogGroups.nextToken))
            }
            return groups
        }
    }
}