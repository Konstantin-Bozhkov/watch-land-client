import { HTTPOptions } from "aws-sdk/lib/config-base";
export interface IAWSClient{
    groups(prefix?:string|undefined):Promise<any[]>
    streams(groups:string, prefix?:string|undefined):Promise<any[]>
    logs(group:string, streams:string[], filters?:ILogsFilter, next?:string|undefined):any
}

export interface IWatcherGroup extends AWS.CloudWatchLogs.LogGroup{
    tag?:string
}
export interface IWathcherStream extends AWS.CloudWatchLogs.LogStreams{
    tag?:string
}
export interface IAWSSharedCredentials{
    profile?: string
    filename?: string
    disableAssumeRole?: boolean
    tokenCodeFn?: (mfaSerial: string, callback: (err?: Error, token?: string) => void) => void
    httpOptions?: HTTPOptions
    callback?: (err?: Error) => void
}

export interface ICloudWatchConfig{
    /* Optional for identifing the CloudWatch instance */
    tag?:string
    /* AWS config */
    options?:AWS.ConfigurationOptions
    /** AWS shared credentials */
    sharedCreds?:IAWSSharedCredentials
    /** Optional for setting localstack */
    endpoint?:string
}

export interface ILogsFilter{
    limit?:number|undefined
    start?:number|undefined
    end?:number|undefined
    pattern?:string|undefined
}