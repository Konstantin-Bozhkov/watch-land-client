import * as Watchland from '.';

const CloudWatch = new Watchland.CloudWatch.Client()

const config:Watchland.CloudWatch.Specs.ICloudWatchConfig = {
    "options":{ region:'eu-west-1' },
    "sharedCreds":{ profile:"kos" }
}
CloudWatch.addWatcher(config)

const awsWatcher = new Watchland.CloudWatch.Watcher(config)
console.log(awsWatcher.getConfig())
const list = CloudWatch.listWatchers()
const retrive = CloudWatch.getWatcher('kos')
const groups = retrive?.watcher.listGroups()
// console.log(list)
console.log('Config ',retrive?.watcher.getConfig())

retrive?.watcher.listGroups().then((groups)=>{
    console.log(groups)
}).catch((err)=>{
    console.log('err', err)
})