import { transforms } from 'advent-of-code-client';
import { numbers } from 'advent-of-code-client/dist/util/transforms';
import { logger, matcher, progBar } from '../util';
import { range, pySlice, roll } from '../util/py';
const Deque = require('collections/deque');

export function part1(input: number): number | string {
    return findElf([...range(input)]);
}

export function part2(input: number): number | string {
    return newRules([...range(input)]);
}

function findElf(elves: number[]): number {
    if (elves.length <= 2) return elves[0] + 1;

    if (elves.length % 2 === 0) {
        return findElf(pySlice(elves, 0, -1, 2));
    } else {
        return findElf(roll(pySlice(elves, 0, -1, 2)))
    }
}

function newRules(elves: number[]): number {
    const n = elves.length;
    if (n <= 2) return elves[0] + 1;

    const across = (Math.floor(n / 2));

    let removed: number;
    let newR: number[];

    if (n % 2 === 0) {
        removed = n - Math.floor(n / 3);
        newR = pySlice(roll(elves, across * -1), 2, -1, 3);
    } else {
        removed = n - Math.floor((n + 1) / 3);
        newR = pySlice(roll(elves, across * -1), 1, -1, 3);
    }

    return newRules(roll(newR, across - removed));
}

// const transform = transforms.lines;
const transform = (d: string): number => +d;

const testData = {
    part1: ['5'],
    part2: ['5']
};

const testAnswers = {
    part1: [3],
    part2: [2]
};

export { transform, testData, testAnswers };