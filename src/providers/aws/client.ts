
import { mutator } from '../../lib/mutator';
import { Watch } from '../../lib/watch';
import { IClientLogs, ICloudWatchConfig, ILogsFilter } from './specs';
import { AwsWatcher } from './watcher';

export class AwsClient{
    private watchers:AwsWatcher[] = [];

    constructor(configs?:ICloudWatchConfig[]){
        if(!configs) return;
        for(const config of configs) this.addWatcher(config);
    }

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
    groups(prefix?:string):Watch{
        const watch = new Watch();
        for(const watcher of this.watchers){
            const groups = watcher.groupsGenerator(prefix)
            mutator(watch, groups, 1000);
        }
        return watch;
    }

    streams(groups:string[], prefix?:string){
        const watch = new Watch();

        for(const watcher of this.watchers){
            for(const group of groups){
                const streams = watcher.streamsGenerator(group, prefix)
                mutator(watch, streams, 1000);
            }
        }
        return watch;
    }

    logs(groups:IClientLogs[], filters?:ILogsFilter){
        const watch = new Watch();
        for(const watcher of this.watchers){
            for(const group of groups){
                const logs = watcher.logsGenerator(group.group, group.streams, filters)
                mutator(watch, logs, 1000);
            }
        }
        return watch;
    }
};

