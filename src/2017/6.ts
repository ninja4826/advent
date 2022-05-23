import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(input: number[]): number | string {
    let set: Set<string> = new Set();
    let cycles = 0;

    while (true) {
        let biggest = Math.max(...input);
        let idx = input.indexOf(biggest);

        let num = input[idx];

        input[idx] = 0;

        for (let i = 1; i <= num; i++) {
            input[(idx + i) % input.length] += 1;
        }
        cycles++;
        if (set.has(input.join(','))) {
            break;
        }
        set.add(input.join(','));
    }
    return cycles;
}

export function part2(input: number[]): number | string {
    let set: Set<string> = new Set();
    let cycles = 0;

    while (true) {
        let biggest = Math.max(...input);
        let idx = input.indexOf(biggest);

        let num = input[idx];

        input[idx] = 0;

        for (let i = 1; i <= num; i++) {
            input[(idx + i) % input.length] += 1;
        }
        if (set.has(input.join(','))) {
            break;
        }
        set.add(input.join(','));
    }

    let found = input.slice(0).join(',');

    while (true) {
        let biggest = Math.max(...input);
        let idx = input.indexOf(biggest);

        let num = input[idx];

        input[idx] = 0;

        for (let i = 1; i <= num; i++) {
            input[(idx + i) % input.length] += 1;
        }
        cycles++;
        if (found === input.join(',')) {
            break;
        }
    }
    return cycles;
}

const transform = (d: string): number[] => d.split('\t').map(Number);
// const transform = (d: string): string => d;

const testData = {
    part1: [`0\t2\t7\t0`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };