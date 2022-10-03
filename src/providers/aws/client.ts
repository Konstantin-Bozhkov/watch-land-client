import * as AwsSdk from 'aws-sdk';
import { ICloudWatchConfig, IWatcherGroup } from './specs';
import { AwsWatcher } from './watcher';

export class AwsClient{
    private watchers:AwsWatcher[] = [];

    constructor(configs?:ICloudWatchConfig[]){
        if(!configs) return;
        for(const config of configs) this.addWatcher(config);
    };

    /**
     * 
     * @param config 
     * Adds a new AWS CloudWatch instance for monitoring
     */
    addWatcher(config:ICloudWatchConfig):void{
        let watcher = new AwsWatcher(config);
        let currentWatchers = this.listWatchers()
        
        // Abort and throw an error if the watcher already exists
        if(currentWatchers.includes(watcher.tag)){
            throw new Error('Watcher with that key is already included')
        };
        this.watchers.push(watcher)
    };

    /**
     * 
     * @param key 
     * @returns Retrieve a CloudWatch instance
     */
    getWatcher(key:string):AwsWatcher|undefined{
        return this.watchers.find((watcher:AwsWatcher)=>watcher.tag === key)
    }
    /**
     * 
     * @returns List of keys for all CloudWatch instance
     */
    listWatchers():string[]{
        const watchers:string[] = this.watchers.map((watcher:AwsWatcher)=>watcher.tag)
        return watchers
    }
    /**
     * 
     * @returns 
     * Get groups from all Watchers(CloudWatch instances)
     */
    async groups(combineGroups:boolean = false):Promise<IWatcherGroup[]>{
        let groups:IWatcherGroup[] = []
        for(const watcher of this.watchers){
            const watcherGroups= await watcher.listGroups()
            groups = [...groups,...watcherGroups]
        }
        return groups;
    }
};

