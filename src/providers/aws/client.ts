import * as AwsSdk from 'aws-sdk';
import { IAwsConfig } from '../specs';
import { AwsWatcher } from './watcher';

interface IAwsWatchers{
    key:string
    watcher:AwsWatcher
}
    
export class AwsClient{
    private watchers:IAwsWatchers[] = [];

    constructor(configs:IAwsConfig[]){
        for(const config of configs) this.addWatcher(config);
    };

    /**
     * 
     * @param config 
     * Adds a new AWS CloudWatch instance for monitoring
     */
    addWatcher(config:IAwsConfig):void{
        let watcher = new AwsWatcher(config);
        let currentWatchers = this.listWatchers()
        let wKey = config.credentials?.profile || 'custom';
        
        // Abort
        if(currentWatchers.includes(wKey)){
            throw new Error('Watcher with that key is already included')
        };
        this.watchers.push({
            "key":wKey,
            "watcher":watcher
        })
    };

    /**
     * 
     * @param key 
     * @returns Retrieve a CloudWatch instance
     */
    getWatcher(key:string):IAwsWatchers|undefined{
        return this.watchers.find((watcher:IAwsWatchers)=>watcher.key === key)
    }
    /**
     * 
     * @returns List of keys for all CloudWatch instance
     */
    listWatchers():string[]{
        const watchers:string[] = []
        for(const watcher of this.watchers){
            watchers.push(watcher.key)
        }
        return watchers
    }
};

