import * as AWS from 'aws-sdk';
import { mutator } from '../../lib/mutator';
import { Watch } from '../../lib/watch';
import { randomName } from '../utils';
import { IAWSClient, ICloudWatchConfig, ILogsFilter, IWatcherGroup, IWatcherStream, IWatcherLog } from './specs';

export class AwsWatcher{
    /* Internal instance name for idendification */
    public tag:string;

    /* AWS CloudWatch SDK instance */    
    private _cw:AWS.CloudWatchLogs;

    /* SDK configuration */
    private _config:ICloudWatchConfig = {};
    
    /* Requests rate to prevent throttling */
    private _rate:number = 1000;

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
        this._config = config;

        // Tag the CloudWatch instance
        this.tag = this._generateTag()
        
        // Set up CloudWatch
        this._cw = new AWS.CloudWatchLogs(configOptions)
    }
    /**
     * 
     * @returns 
     * Returns the initial config of the instance
     */
    getConfig(){
        return this._cw.config
    }
    
    /**
     * 
     * @param rate
     * Sets AWS API requests per second
     * Note that AWS have limitation on API requests per second for region and account, when the rate is exceeded
     * all further requests are throttled. Recomended Wathcland request rate 1000ms 
     */
    refreshRate(rate:number){
        this._rate = rate;
    }

    /**
     * Throws an error if the connection fail
     * @returns 
     */
     async checkConnection(){
        let params:AWS.CloudWatchLogs.DescribeLogGroupsRequest = { limit:1 };
        await this._cw.describeLogGroups(params).promise()
        return true
    }
    
    /**
     * 
     * @returns 
     * Get a for the instance. If no tag or profile was supplied to the Watcher config
     * the tag will be a random generated name
     */
    private _generateTag(){
        const tag = this._config.tag ? this._config.tag : this._config.sharedCreds?.profile || randomName();
        return tag
    }
    /**
     * 
     * @param prefix Prefix for of the log groups to fetch
     * @returns 
     * A list of all groups in the AWS account
     */    
    groups(prefix?:string):Watch{
        const watch = new Watch();
        const groups = this.groupsGenerator(prefix)
        mutator(watch, groups, this._rate);
        return watch
    }

    /**
     * 
     * @param prefix 
     */
    async *groupsGenerator(prefix?:string){
        let groups:IWatcherGroup[] = [];
        
        let params:AWS.CloudWatchLogs.DescribeLogGroupsRequest = {
            logGroupNamePrefix:prefix,
            nextToken: undefined
        };

        do{
            let LogGroups = await this._cw.describeLogGroups(params).promise()
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
        const streams = this.streamsGenerator(group, prefix)        
        mutator(watch, streams, this._rate);
        return watch;
    }

    async *streamsGenerator(group:string, prefix?:string|undefined){
        let streams:IWatcherStream[] = [];
        
        let params:AWS.CloudWatchLogs.DescribeLogStreamsRequest = {
            logGroupName: group, /* required */
            descending: true,
            nextToken: undefined,
            logStreamNamePrefix: prefix
        };
        
        do{    
            let LogStreams = await this._cw.describeLogStreams(params).promise()
            streams = [].concat(LogStreams.logStreams as []);
            params.nextToken = LogStreams.nextToken
            // Tag the streams with the watcher
            streams.forEach((stream:IWatcherStream)=>stream.tag = this.tag)
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
    logs(group:string, streams?:string[], filters?:ILogsFilter):Watch{
        const watch = new Watch();
        const logs = this.logsGenerator(group, streams, filters)        
        mutator(watch, logs, this._rate);
        return watch;
    }

    /**
     * 
     * @param group 
     * @param streams 
     * @param filters 
     * @return AsyncGenerator
     */
    async *logsGenerator(group:string, streams?:string[], filters?:ILogsFilter){
        let logs:IWatcherLog[] = [];

        const params:AWS.CloudWatchLogs.FilterLogEventsRequest = {
            logGroupName: group,
            limit:filters?.limit,
            logStreamNames: streams,
            filterPattern: filters?.pattern,
            endTime: filters?.end,
            startTime: filters?.start,
            nextToken:undefined,
        };

        do{
            const LogEvents = await this._cw.filterLogEvents(params).promise();
            logs = [].concat(LogEvents.events as []);
            params.nextToken = LogEvents.nextToken
            // Tag the logs with the watcher
            logs.forEach((log:IWatcherLog)=>{
                log.tag = this.tag
                log.group = group
            })
            yield logs
        }
        while(params.nextToken)
    }
}