import { HTTPOptions } from "aws-sdk/lib/config-base"

export interface IAWSClient{
    listGroups(prefix?:string):Promise<any[]>
    listStreams(prefix?:string):Promise<any[]>
    listLogEvents(group:string, streams:string[], filters?:ILogsFilter, next?:string|undefined):any
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
    options?:AWS.ConfigurationOptions
    sharedCreds?:IAWSSharedCredentials
    endpoint?:string
}

export interface ILogsFilter{
    limit?:number|undefined
    start?:number|undefined
    end?:number|undefined
    pattern?:string|undefined
}