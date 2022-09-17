import { ITimeUnitPatterns, TUnitPattern } from "./specs";

/**
 * 
 * @param time_text 
 * @returns amount, seconds
 * Human readable text or exact date and returns the amount of 
 * minutes|hours|days|weeks and how many second there are in each
 * 
 * Input "2 days" 
 * Output : [2, 86400]
 */
export const getAmountOfSeconds = (time_text:string)=>{
    let amount:number = 0;
    let seconds:number = 0;
    let unit_patterns:ITimeUnitPatterns = {
        "minutes": { "regex":/^\b\d+ \b(m|minute|minutes)\b$/, "seconds":60 },
        "hours"  : { "regex":/^\b\d+ \b(h|hour|hours)\b$/, "seconds":3600 },
        "days"   : { "regex":/^\b\d+ \b(d|day|days)\b$/, "seconds":86400 },
        "weeks"  : { "regex":/^\b\d+ \b(w|week|weeks)\b$/, "seconds":604800 }
    }
    
    for(const pattern_key of Object.keys(unit_patterns)){
        let unit_pattern = unit_patterns[pattern_key as TUnitPattern] ;
        let time_regex = new RegExp(unit_pattern.regex, 'ig')
        let time_match = time_text.match(time_regex);
        
        if(!time_match) continue;
        seconds = unit_pattern.seconds
        amount = Number(time_match[0].split(' ')[0]); // the number of mins, hours, days or weeks
        break;
    }  
    return [ amount, seconds ];
}

/**
 * 
 * @param time_text 
 * @returns Unix timestamp
 * Get an exact date or human readable input - number of minutes, hours, days or weeks
 * Ex minutes: 
 *  - "1 minute" - possible variation "m", "minute", "minutes"
 *  - "1 hour" - possible variation "h", "hour", "hours"
 *  - "1 day" - possible variation "d", "day", "days"
 *  - "1 week" - possible variation "w", "week", "weeks"
 */
export const stringToTimestamp = (time_text:string)=>{
    const now = Math.floor(Date.now()/1000)
    const [amount, seconds] = getAmountOfSeconds(time_text);
    const date = new Date((now - amount * seconds) * 1000)
    return date.getTime();
}