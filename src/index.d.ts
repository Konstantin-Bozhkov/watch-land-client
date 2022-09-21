export * as CloudWatch from "./providers/aws";
export * as Metrics from "./providers/azure"
export * as LogExplorer from "./providers/gcloud"

export as namespace WatchLand;
// class WatchLand{

//     // Available Cloud providers
//     private providers = {
//         [CloudProvider.AWS] : AWSCloud.AwsClient,
//         [CloudProvider.Azure] : AzureCloud.AzureClient,
//         [CloudProvider.gCloud] : GoogleCloud.GoogleCloudClient
//     };

//     // Cloud provider to be in use 
//     private provider:AWSCloud.AwsClient|AzureCloud.AzureClient|GoogleCloud.GoogleCloudClient

//     /**
//      * 
//      * @param provider Cloud provider to use AWS, Azure or Google Cloud
//      * @param config Configuration options for the cloud provider
//      */
//     constructor(provider:CloudProvider.AWS, config:IAwsConfig){
//         this.provider = new this.providers[provider](config);
//     }

//     /** 
//      * @param limit 
//      * 
//      * Returns all log groups
//      */
//     async groups(limit:number = 25):Promise<any[]>{
//         const groups = await this.provider.listGroups() as []
//         return groups
//     }

//     /**
//      * 
//      * @param group Group name
//      * @returns 
//      */
//     async streams(group:string):Promise<any[]>{
//         const streams = await this.provider.listStreams(group) as []
//         return streams
//     }
    
//     /**
//      * 
//      * @param group Group name
//      * @param stream Stream name
//      */
//      async *logs(group:string, streams:string[], filters?:ILogsFilter):any{
//         yield* this.provider.listLogEvents(group, streams, { ...filters })
//     }
// }


// const config:IAwsConfig = { 
//     credentials:{
//         profile:'kos'
//     },
//     options:{        
//         region:'eu-west-1' 
//     }
// }

// // const client = new WatchLand(CloudProvider.AWS, config)
// const client = new AWSCloud.AwsClient([config])
// const watcher = client.getWatcher('kos')
// watcher?.watcher.listGroups().then((res:any)=>{console.log(res)})
// // console.log(client.getWatcher('kos'))
// console.log(client.listWatchers())

// const groups = client.groups(1).then((groups)=>{
//     console.log('Groups: ', groups)
// });

// const streams = client.streams('/aws/lambda/test').then((streams)=>{
//     console.log('Streams: ', streams)
// })

// const logMe = async ()=>{
    // const group = '/aws/lambda/test';
    // const streams = ['2022/05/23/[$LATEST]887be0e64f9e4b1f863665a72c32507a']
    // const log = await client.logs(group, streams, {
    //     limit:200
    // })
    // setInterval(async()=>{
    //     let next = await log.next()
    //     console.log('Valu: ',next.value)
    // }, 1000)
// }

// logMe()
