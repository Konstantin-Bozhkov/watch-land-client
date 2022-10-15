# Watch Land Client
Typescript client for bulk quering logs from AWS, Azure and Google Cloud

The client relies on the concept of a "Watcher", where each "Watcher" is connection via the cloud SDKs libraries.

## Usage

### Import Watchland and initialize AWS Cloudwatch

```
import * as Watchland from "watch-land-ts-client";

// Create a AWS CloudWatch client instance
const CloudWatch = new Watchland.CloudWatch.Client();
```

### Add the AWS connections
```
// First AWS connection
const config1:Watchland.CloudWatch.Specs.ICloudWatchConfig = {
    "options":{ region: "eu-west-1" },
    "sharedCreds":{ profile: "my:aws:profile" }
}

// Second AWS connection
const config2:Watchland.CloudWatch.Specs.ICloudWatchConfig = {
    "options":{ region:'us-east-2' },
    "sharedCreds":{ profile:"my-second-profile" }
}

// Add the watchers to the client
CloudWatch.addWatcher(config1)
CloudWatch.addWatcher(config2)
```

### Retrieve the data
`observe` unlike `then` will not wait for then entire promise to resolve before it returns 
the data, but instead will return the data as soon as it comes

```
// Get the groups from all watchers
CloudWatch.groups().observe((data)=>{
    console.log('Groups ', data)
})

// Get the streams from specific groups
const groups = ["/aws/lambda/test", "/aws/lambda/test-2"]
CloudWatch.streams(groups).observe((data)=>{
     console.log('Streams: ', data)
}).catch((error)=>{
     console.log('Error')
})

// Get the logs for specifi groups and streams
const logGroups = [{group:"/aws/lambda/test"}]
CloudWatch.logs(logGroups).observe((data)=>{
    console.log('Logs: ',data)
})```
