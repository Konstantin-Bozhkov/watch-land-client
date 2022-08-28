import * as AWS from 'aws-sdk';
import { IAwsConfig, ICloudClient, ILogsFilter } from '../specs';
export namespace AWSCloud{
    
    export class AwsClient implements ICloudClient{
        private cw:AWS.CloudWatchLogs;

        /**
         * 
         * @param config 
         */
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

        /**
         * 
         * @param prefix Prefix for of the log groups to fetch
         * @returns 
         */
        async listGroups(prefix:string = ''):Promise<any[]>{
            const params:AWS.CloudWatchLogs.DescribeLogGroupsRequest = {
                limit:50
            }
            if(prefix != '') params.logGroupNamePrefix = prefix;
            const groups = this._fetchGroups(params)
            return groups
        }
        
        /**
         * 
         * @param group Group name
         * @param prefix Prefix for the streams to fetch
         * @returns 
         */
         async listStreams(group:string, prefix:string = ''){
            const params:AWS.CloudWatchLogs.DescribeLogStreamsRequest = {
                logGroupName: group, /* required */
                descending: true,
            };
            // Add the stream prefix if passed as argument
            if(prefix != '') params.logStreamNamePrefix = prefix;
            const streams = this._fetchStreams(params)
            console.log('Stre' , streams)
            return streams
        }

        /**
         * 
         * @param group 
         * @param streams 
         * @param filters 
         * @param next 
         */
        async *listLogEvents (group:string, streams:string[], filters?:ILogsFilter, next?:string|undefined ){
            const params:AWS.CloudWatchLogs.FilterLogEventsRequest = {
                logGroupName: group,
                limit: filters?.limit,
                logStreamNames: streams,                
                filterPattern: filters?.pattern,
                endTime: filters?.end,
                startTime: filters?.start,
                nextToken:next
            };
            let [ logs, nextToken, keys ] = await this._fetchLogs(params, [])
            yield logs;

            while(keys && keys.includes('nextToken')){
                params.nextToken = nextToken as string;
                [ logs, nextToken, keys ] = await this._fetchLogs(params, keys as string[]);
                yield logs;
            }
        }
        
        /**
         * 
         * @param params 
         * @returns 
         */
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
      
        /**
         * 
         * @param params 
         * @returns 
         */
        private async _fetchStreams(params: AWS.CloudWatchLogs.DescribeLogStreamsRequest){
            let awsStreams = await this.cw.describeLogStreams(params).promise()
            let streams:AWS.CloudWatchLogs.LogStreams[] = [].concat(awsStreams.logStreams as []);
            let keys = Object.keys(awsStreams);
            // Keep fetching the streams untill all streams are fetched
            if(keys.includes('nextToken')){
                params.nextToken = awsStreams.nextToken;
                streams = streams.concat( await this._fetchStreams(params))
            }
            return streams
        }

        /**
         * 
         * @param params 
         * @param keys 
         * @returns 
         */
        async _fetchLogs(params:AWS.CloudWatchLogs.FilterLogEventsRequest, keys:string[]){
            const awsLogs = await this.cw.filterLogEvents(params).promise();
            const resKeys = Object.keys(awsLogs);
            return [ awsLogs.events, awsLogs.nextToken, resKeys]
        }
    }
}