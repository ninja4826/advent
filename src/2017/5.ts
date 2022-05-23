import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(input: number[]): number | string {
    let point = 0;
    let i = 0;
    while (point < input.length && point > -1) {
        let curr = point;
        point += input[point];
        input[curr] += 1;
        i++;
    }
    return i;
}

export function part2(input: number[]): number | string {
    let point = 0;
    let i = 0;
    while (point < input.length && point > -1) {
        let curr = point;
        point += input[point];
        if (input[curr] > 2) {
            input[curr] -= 1;
        } else {
            input[curr] += 1;
        }
        i++;
    }
    return i;
}

// const transform = transforms.lines;
const transform = (d: string): number[] => d.split('\n').map(Number);
// const transform = (d: string): string => d;

const testData = {
    part1: [`0
3
0
1
-3`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };