import { transforms } from 'advent-of-code-client';
import { logger } from '../util';

export function part1(input: number[]): number | string {
    return input.reduce((p, c) => p+c, 0);
}

export function part2(input: any): number | string {
    let freqs: number[] = [];
    let freq = 0;
    while (true) {
        for (let i of input) {
            freq += i;
            if (freqs.includes(freq)) {
                return freq;
            }
            freqs.push(freq);
        }
    }
}

const transform = (data: string): number[] => data.split('\n').map(Number);

const testData = {
    part1: ``,
    part2: ``
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };