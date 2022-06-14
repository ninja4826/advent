import { transforms } from 'advent-of-code-client';
import md5 from 'md5';
// import { logger, matcher, progBar } from '../util';

export function part1(input: string): number | string {
    return findHash(input);
}

export function part2(input: string): number | string {
    return findHash(input, 6);
}

function findHash(input: string, zeroes: number = 5): number {
    let i = 0;
    while (true) {
        let hash = md5(input + i);
        if (hash.startsWith('0'.repeat(zeroes))) {
            return i;
        }
        i += 1;
    }
    return -1;
}

// const transform = transforms.lines;
const transform = (d: string): string => d;

const testData = {
    part1: ['abcdef', 'pqrstuv'],
    part2: [``]
};

const testAnswers = {
    part1: [609043, 1048970],
    part2: [0]
};

export { transform, testData, testAnswers };