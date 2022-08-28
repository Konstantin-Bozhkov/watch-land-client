import { HTTPOptions } from "aws-sdk/lib/config-base"

export interface ICloudClient{
    listGroups(prefix?:string):Promise<any[]>
    listStreams(prefix?:string):Promise<any[]>
    listLogEvents(group:string, streams:string[], filters?:ILogsFilter, next?:string|undefined):any
}
export interface IAWSConfigOptions{
    profile?: string
    filename?: string
    disableAssumeRole?: boolean
    tokenCodeFn?: (mfaSerial: string, callback: (err?: Error, token?: string) => void) => void
    httpOptions?: HTTPOptions
    callback?: (err?: Error) => void
}
export interface IAwsConfig{
    credentials?:IAWSConfigOptions
    options?:AWS.ConfigurationOptions
}
export interface ILogsFilter{
    limit?:number|undefined
    start?:number|undefined
    end?:number|undefined
    pattern?:string|undefined
}