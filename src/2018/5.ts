import { transforms } from 'advent-of-code-client';
import { logger, matcher } from '../util';

export function part1(input: any): number | string {
    const data = collapsePolymer(input);
    return data.length;
}

export function part2(input: string[]): number | string {
    let counts: number[] = [];
    
    for (let i = 0; i < 26; i++) {
        let lower = (i+10).toString(36);
        let upper = lower.toUpperCase();

        let data = input
            .slice(0)
            .join('')
            .split(lower)
            .join('')
            .split(upper)
            .join('')
            .split('');
        let collapsed = collapsePolymer(data);
        counts.push(collapsed.length);
    }
    return Math.min(...counts);
}

function collapsePolymer(data: string[]): string[] {
    const input = data.slice(0);
    let lowerArr = [];
    for (let i = 0; i < 26; i++) {
        lowerArr.push((i+10).toString(36));
    }
    let upperArr = lowerArr.map(c => c.toUpperCase());
    let hasSpliced = false;
    while (true) {
        hasSpliced = false;
        for (let i = 0; i < input.length - 1; i++) {
            let doSplice = false;
            if (lowerArr.includes(input[i])) {
                doSplice = input[i+1] === upperArr[lowerArr.indexOf(input[i])]
            } else {
                doSplice = input[i+1] === lowerArr[upperArr.indexOf(input[i])]
            }

            if (doSplice) {
                hasSpliced = true;
                input.splice(i, 2);
                // logger.log(input.join(''));
            }
        }
        if (!hasSpliced) {
            break;
        }
    }

    return input;
}

const transform = (data: string): string[] => data.split('');

const testData = {
    part1: `dabAcCaCBAcCcaDA`,
    part2: `dabAcCaCBAcCcaDA`
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };