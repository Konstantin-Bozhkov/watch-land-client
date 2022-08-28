// export interface ICloudProvider{
//     listGroups()
// }

import { HTTPOptions } from "aws-sdk/lib/config-base"

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