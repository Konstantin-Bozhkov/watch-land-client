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

        async listGroups(prefix:string = ''):Promise<any[]>{
            const params:AWS.CloudWatchLogs.DescribeLogGroupsRequest = {
                limit:50
            }
            if(prefix != '') params.logGroupNamePrefix = prefix;
            const groups = this._fetchGroups(params)
            return groups
        }
        
        private async _fetchGroups(params: AWS.CloudWatchLogs.DescribeLogGroupsRequest){
            let awslogGroups = await this.cw.describeLogGroups(params).promise()
            let groups:AWS.CloudWatchLogs.LogGroup[] = [].concat(awslogGroups.logGroups as []);
            let keys = Object.keys(awslogGroups);
            // Keep calling list groups untill all groups are fetched
            if(keys.includes('nextToken')){
                params.nextToken = awslogGroups.nextToken;
                groups = groups.concat( await this._fetchGroups(params))
            }
            return groups
        }

        async listStreams(group:string, prefix:string = ''){
            const params:AWS.CloudWatchLogs.DescribeLogStreamsRequest = {
                logGroupName: group, /* required */
                descending: true,
            };
            // Add the stream prefix if passed as argument
            if(prefix != '') params.logStreamNamePrefix = prefix;
            const streams = this._fetchStreams(params)
            return streams
        }

        private async _fetchStreams(params: AWS.CloudWatchLogs.DescribeLogStreamsRequest){
            let awsStreams = await this.cw.describeLogStreams(params).promise()
            let streams:AWS.CloudWatchLogs.LogGroup[] = [].concat(awsStreams.logStreams as []);
            let keys = Object.keys(awsStreams);
            // Keep fetching the streams untill all streams are fetched
            if(keys.includes('nextToken')){
                params.nextToken = awsStreams.nextToken;
                streams = streams.concat( await this._fetchStreams(params))
            }
            return streams
        }

    }
}