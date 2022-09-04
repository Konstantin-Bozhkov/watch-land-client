import { ITimeUnitPatterns, TUnitPattern } from "./specs";

export const stringToTimestamp = (time_text:string)=>{
    const unit_patterns:ITimeUnitPatterns = {
        "minutes": { "regex":/^\b\d+ \b(m|minute|minutes)\b$/, "seconds":60 },
        "hours"  : { "regex":/^\b\d+ \b(h|hour|hours)\b$/, "seconds":3600 },
        "days"   : { "regex":/^\b\d+ \b(d|day|days)\b$/, "seconds":86400 },
        "weeks"  : { "regex":/^\b\d+ \b(w|week|weeks)\b$/, "seconds":604800 }
    }
    const now = Math.floor(Date.now()/1000)
    let amount:number = 0;
    let seconds:number = 0;

    for(const pattern_key of Object.keys(unit_patterns)){
        const pattern = unit_patterns[pattern_key as TUnitPattern] ;
        const time_regex = new RegExp(pattern.regex, 'ig')
        const time_match = time_text.match(time_regex);
        
        if(!time_match) continue;
        
        seconds = pattern.seconds
        amount = Number(time_match[0].split(' ')[0]); // the number of mins, hours, days or weeks
        break;
    }    

    const date = new Date((now - amount * seconds) * 1000)
    return date.getTime();
}