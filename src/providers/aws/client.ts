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

    addWatcher(config:IAwsConfig){
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
    getWatcher(key:string){
        return this.watchers.find((watcher:IAwsWatchers)=>watcher.key === key)
    }
    listWatchers(){
        const watchers:string[] = []
        for(const watcher of this.watchers){
            watchers.push(watcher.key)
        }
        return watchers
    }
};

