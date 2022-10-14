import * as AWS from 'aws-sdk';
import { Watch } from '../../lib/watch';
import { randomName } from '../utils';
import { IAWSClient, ICloudWatchConfig, ILogsFilter, IWatcherGroup, IWathcherStream } from './specs';

export class AwsWatcher{
    public tag:string;
    private cw:AWS.CloudWatchLogs;
    private config:ICloudWatchConfig = {};
    private rate:number = 1000;
    /**
     * 
     * @param config 
     */
    constructor(config:ICloudWatchConfig){
        const configOptions = config.endpoint ? { endpoint:(config.endpoint)}:undefined
        
        AWS.config.update(config.options ? config.options : {});   

        if(config.sharedCreds){
            const credentials = new AWS.SharedIniFileCredentials(config.sharedCreds);
            AWS.config.update({credentials:credentials})
        }
        // Save the config for future refence
        this.config = config;

        // Tag the CloudWatch instance
        this.tag = this._getTag()
        
        // Set up CloudWatch
        this.cw = new AWS.CloudWatchLogs(configOptions)
    }
    /**
     * 
     * @returns 
     * Returns the initial config of the instance
     */
    getConfig(){
        return this.cw.config
    }

    refreshRate(rate:number){
        this.rate = rate;
    }

    /**
     * 
     * @returns 
     * Get a for the instance. If no tag or profile was supplied to the Watcher config
     * the tag will be a random generated name
     */
    private _getTag(){
        const tag = this.config.tag ? this.config.tag : this.config.sharedCreds?.profile || randomName();
        return tag
    }

    private mutator(watch:Watch, generator:AsyncGenerator):NodeJS.Timer{
        const mutator:NodeJS.Timer = setInterval(async ()=>{
            const data = await generator.next()
            if(data.value != undefined && data.value.length > 0){
                watch.resolve(data.value);
            }
            if(data.done === true){
                clearInterval(mutator)
            }
        }, this.rate) 
        return mutator
    }
    /**
     * 
     * @param prefix Prefix for of the log groups to fetch
     * @returns 
     * A list of all groups in the AWS account
     */    
    groups(prefix?:string):Watch{
        const watch = new Watch();
        const groups = this._groups(prefix)
        this.mutator(watch, groups);
        return watch
    }

    /**
     * 
     * @param prefix 
     */
    private async *_groups(prefix?:string){
        let groups:IWatcherGroup[] = [];
        
        let params:AWS.CloudWatchLogs.DescribeLogGroupsRequest = {
            logGroupNamePrefix:prefix,
            nextToken: undefined,
        };

        do{
            let LogGroups = await this.cw.describeLogGroups(params).promise()
            groups = [].concat(LogGroups.logGroups as []);
            params.nextToken = LogGroups.nextToken
            // Tag the groups with the watcher
            groups.forEach((group:IWatcherGroup)=>group.tag = this.tag)
            yield groups
        }
        while(params.nextToken)
    }
    

    /**
     * 
     * @param group Group name
     * @param prefix Prefix for the streams to fetch
     * @returns 
     * A list of all streams for a given group in the AWS account
     */
    streams(group:string, prefix?:string|undefined):Watch{
        const watch = new Watch();
        const streams = this._streams(group, prefix)        
        this.mutator(watch, streams);
        return watch;
    }

    private async *_streams(group:string, prefix?:string|undefined){
        let streams:IWathcherStream[] = [];
        
        let params:AWS.CloudWatchLogs.DescribeLogStreamsRequest = {
            logGroupName: group, /* required */
            descending: true,
            nextToken: undefined,
            limit:1,
            logStreamNamePrefix: prefix
        };
        
        do{    
            let LogStreams = await this.cw.describeLogStreams(params).promise()
            streams = [].concat(LogStreams.logStreams as []);
            params.nextToken = LogStreams.nextToken
            // Tag the streams with the watcher
            streams.forEach((stream:IWathcherStream)=>stream.tag = this.tag)
            yield streams
        }
        while(params.nextToken)
    }

    /**
     * 
     * @param group 
     * @param streams 
     * @param filters 
     * @returns 
     */
    logs(group:string, streams:string[], filters?:ILogsFilter):Watch{
        const watch = new Watch();
        const logs = this._logs(group, streams, filters)        
        this.mutator(watch, logs);
        return watch;
    }

    /**
     * 
     * @param group 
     * @param streams 
     * @param filters 
     * @return AsyncGenerator
     */
    private async *_logs(group:string, streams:string[], filters?:ILogsFilter){
        let logs:AWS.CloudWatchLogs.FilteredLogEvents[] = [];
        const params:AWS.CloudWatchLogs.FilterLogEventsRequest = {
            logGroupName: group,
            limit: filters?.limit,
            logStreamNames: streams,
            filterPattern: filters?.pattern,
            endTime: filters?.end,
            startTime: filters?.start,
            nextToken:undefined
        };

        do{
            const LogEvents = await this.cw.filterLogEvents(params).promise();
            logs = [].concat(LogEvents.events as []);
            params.nextToken = LogEvents.nextToken
            // Tag the streams with the watcher
            // logs.forEach((log:AWS.CloudWatchLogs.FilteredLogEvents)=>log.tag = this.tag)
            yield logs
        }
        while(params.nextToken)
    }
}