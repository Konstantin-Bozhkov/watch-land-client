export enum CloudProvider{
    AWS = 'aws',
    Azure = 'azure',
    gCloud = 'google'
}

export interface ITimeUnitPattern{
    regex:RegExp
    seconds:number
}
export interface ITimeUnitPatterns{
    minutes:ITimeUnitPattern
    hours:ITimeUnitPattern
    days:ITimeUnitPattern
    weeks:ITimeUnitPattern
}

export type TUnitPattern = keyof ITimeUnitPatterns;