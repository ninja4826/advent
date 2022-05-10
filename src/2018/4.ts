import { transforms } from 'advent-of-code-client';
import { logger, matcher } from '../util';

export function part1(input: string[]): number | string {
    const guards = getGuards(input);

    let maxSleeps = 0;
    let maxID = 0;
    guards.forEach((sleeps, id) => {
        if (sleeps.length > maxSleeps) {
            maxSleeps = sleeps.length;
            maxID = id;
        }
    });

    return maxID * mode(<number[]>guards.get(maxID));
}

export function part2(input: any): number | string {
    const modeCount = (a: number[]): number => {
        let m = mode(a);
        let count = 0;
        for (let i = 0; i < a.length; i++) {
            if (a[i] == m) {
                count++;
            }
        }

        return count;
    };

    const guards = getGuards(input);

    let maxCount = 0;
    let maxID = 0;

    for (let [k, v] of guards) {
        let m = modeCount(v);
        if (m > maxCount) {
            maxCount = m;
            maxID = k;
        }
    }
    
    return maxID * mode(<number[]>guards.get(maxID));
}

function mode(a: number[]): number {
    a = a.slice().sort((x, y) => x - y);

    let bestStreak = 1;
    let bestElem = a[0];
    let currentStreak = 1;
    let currentElem = a[0];

    for (let i = 0; i < a.length; i++) {
        if (a[i-1] !== a[i]) {
            if (currentStreak > bestStreak) {
                bestStreak = currentStreak;
                bestElem = currentElem;
            }

            currentStreak = 0;
            currentElem = a[i];
        }

        currentStreak++;
    }

    return currentStreak > bestStreak ? currentElem : bestElem;
}

function getGuards(input: string[]): Map<number, number[]> {
    let reg1 = /\[(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2}) (?<hour>\d{2}):(?<minute>\d{2})] (?<event>\w)/;
    let reg2 = /\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}] Guard #(?<id>\d+) begins shift/;
    let events: IEvent[] = [];
    
    for (let inp of input) {
        let match = matcher(inp, reg1);

        const [ year, month, day, hour, minute ] = ['year', 'month', 'day', 'hour', 'minute'].map(c => +match.groups[c]);
        const eventType = (match.groups.event == 'G' ? EEventType.NewShift : (match.groups.event == 'w' ? EEventType.WakeUp : EEventType.FallAsleep));
        let extra = 0;
        if (eventType == EEventType.NewShift) {
            let match2 = matcher(inp, reg2);
            extra = +match2.groups.id;
        }
        let event: IEvent = {
            year,
            month,
            day,
            hour,
            minute,
            extra,
            eventType
        };

        events.push(event);
    }

    events.sort((a, b) => (a.year - b.year || a.month - b.month || a.day - b.day || a.hour - b.hour || a.minute - b.minute));

    const guards: Map<number, number[]> = new Map();

    let currGuard = 0;
    let startSleep = 0;
    let sleepArr: number[] = [];
    
    for (let event of events) {
        switch (event.eventType) {
            case EEventType.NewShift:
                if (!guards.has(currGuard) && currGuard !== 0) {
                    guards.set(currGuard, []);
                }

                if (currGuard !== 0) {
                    guards.set(currGuard, (<number[]>guards.get(currGuard)).concat(sleepArr));
                }

                currGuard = event.extra;
                sleepArr = [];
                break;
            case EEventType.FallAsleep:
                startSleep = event.minute;
                break;
            case EEventType.WakeUp:
                for (let i = startSleep; i < event.minute; i++) {
                    sleepArr.push(i);
                }
        }
    }

    if (!guards.has(currGuard)) {
        guards.set(currGuard, []);
    }
    guards.set(currGuard, (<number[]>guards.get(currGuard)).concat(sleepArr));

    return guards;
}

interface IEvent {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    extra: number;
    eventType: EEventType;
}

enum EEventType {
    NewShift,
    WakeUp,
    FallAsleep
}

const transform = transforms.lines;

const testData = {
    part1: `[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-05 00:55] wakes up`,
    part2: `[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-05 00:55] wakes up`
};

const testAnswers = {
    part1: 240,
    part2: 4455
};

export { transform, testData, testAnswers };