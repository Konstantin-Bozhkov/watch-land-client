import * as AWS from 'aws-sdk';
export namespace AWSCloud{
    
    export class AwsClient{
        private cw:AWS.CloudWatchLogs;

        constructor(){
            // Set the region 
            AWS.config.update({region: 'eu-west-1'});
            // Set up cloudwatch
            this.cw = new AWS.CloudWatchLogs()
        }

        listLogGroups(){
            const params:AWS.CloudWatchLogs.DescribeLogGroupsRequest = {
                limit:25
            }
            this.cw.describeLogGroups(params, (err:AWS.AWSError, data:AWS.CloudWatchLogs.DescribeLogGroupsRequest)=>{
                if (err) {
                    console.log("Error", err);
                } else {
                    console.log("Success", data);
                }
            })
        }

    }

    
}