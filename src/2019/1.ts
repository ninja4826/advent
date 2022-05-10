import { transforms } from 'advent-of-code-client';
import { logger } from '../util';

export function part1(input: number[]): number | string {
    return input.map(c => Math.floor(c / 3) - 2).reduce((p: number, c: number): number => p+c, 0);
}

export function part2(input: number[]): number | string {
    let curr = input.map(c => Math.floor(c / 3) - 2).reduce((p: number, c: number): number => p+c, 0);

    let total = curr;

    while (true) {
        curr = Math.floor(curr / 3) - 2;

        if (curr < 1) {
            break;
        }
        total += curr;
    }

    return total;
}

const transform = transforms.numbers;

const testData = {
    part1: '12\n14\n1969\n100756',
    part2: '100756'
};

const testAnswers = {
    part1: 34241,
    part2: 50346
};

export { transform, testData, testAnswers };