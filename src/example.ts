import * as Watchland from '.';

const CloudWatch = new Watchland.CloudWatch.Client()

const config1:Watchland.CloudWatch.Specs.ICloudWatchConfig = {
    "options":{ region:'eu-west-1' },
    "sharedCreds":{ profile:"kos" },
    // "endpoint":"http://localhost:4572/"
}
const config2:Watchland.CloudWatch.Specs.ICloudWatchConfig = {
    "options":{ region:'eu-west-1' },
    "sharedCreds":{ profile:"7eleven" },
    // "endpoint":"http://localhost:4572/"
}
CloudWatch.addWatcher(config1)
CloudWatch.addWatcher(config2)

const list = CloudWatch.listWatchers()
const retrive = CloudWatch.getWatcher('kos')

// console.log(list)
const combine = false
// const groups = retrive?.watcher.listGroups()
const groups = CloudWatch.groups().then((logGroups)=>{
    // console.log(logGroups)

    // for(const group of logGroups){
    //     console.log(group)
    // }
})

// console.log(retrive?.watcher)
// console.log('Config ',retrive?.watcher.getConfig())

// retrive?.watcher.listGroups().then((groups)=>{
//     console.log(groups)
// }).catch((err)=>{
//     console.log('err', err)
// })