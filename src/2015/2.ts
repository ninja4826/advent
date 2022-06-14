import { transforms } from 'advent-of-code-client';
// import { logger, matcher, progBar } from '../util';

export function part1(input: string[]): number | string {
    let count = 0;
    for (let inp of input) {
        let s = inp.split('x').map(Number);

        let sides: number[] = [2 * s[0] * s[1],
                               2 * s[1] * s[2],
                               2 * s[0] * s[2]];
        count += sides.reduce((p, c) => p+c, 0) + (Math.min(...sides) / 2);
    }
    return count;
}

export function part2(input: string[]): number | string {
    let count = 0;

    for (let inp of input) {
        let s = inp.split('x').map(Number);
        s.sort((a, b) => a - b);

        count += (2 * s[0]) + (2 * s[1]);
        count += s.reduce((p, c) => p*c, 1);
    }
    return count;
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: ['2x3x4', '1x1x10'],
    part2: ['2x3x4', '1x1x10']
};

const testAnswers = {
    part1: [58, 43],
    part2: [34, 14]
};

export { transform, testData, testAnswers };