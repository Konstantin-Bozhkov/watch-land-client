import { getAmountOfSeconds, stringToTimestamp } from "../utils";

test('Test minutes - 25 minutes', () => {
    const str = '25 m';
    const [amount, seconds] = getAmountOfSeconds(str)
    expect(amount).toBe(25);
    expect(seconds).toBe(60);
});

test('Test hours - 5 hours', () => {
    const str = '5 hour'
    const [amount, seconds] = getAmountOfSeconds(str)
    expect(amount).toBe(5);
    expect(seconds).toBe(3600);
});

test('Test days - 10 days', () => {
    const str = '10 days'
    const [amount, seconds] = getAmountOfSeconds(str)
    expect(amount).toBe(10);
    expect(seconds).toBe(86400);
});

test('Test weeks - 4 week', () => {
    const str = '4 weeks'
    const [amount, seconds] = getAmountOfSeconds(str)
    expect(amount).toBe(4);
    expect(seconds).toBe(604800);
});

test('Test parsing a string date to unix timestamp', ()=>{
    const str = '1 day';
    const now = Math.floor(Date.now()/1000)
    const date = new Date((now - 1 * 86400) * 1000).getTime()
    const time = stringToTimestamp(str);
    expect(time).toBe(date);
})