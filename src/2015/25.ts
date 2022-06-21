import { transforms } from 'advent-of-code-client';
import { matcher } from '../util';

export function part1(input: string): number | string {
    let reg = /\D*(\d+),\D+(\d+)\.?/;
    let match = matcher(input, reg);
    
    let tgtRow = +match[2];
    let tgtCol = +match[1];

    let rowStart = 0;
    for (let i = 1; i <= tgtRow; i++) {
        rowStart += i;
    }

    let recurseTgt = rowStart;

    for (let i = 0; i < tgtCol - 1; i++) {
        recurseTgt += (i + tgtRow);
    }

    let num = 20151125;

    for (let i = 1; i < recurseTgt; i++) {
        num *= 252533;
        num = num % 33554393;
    }

    return num;
}

export function part2(input: string): number | string {
    return 0;
}

// const transform = transforms.lines;
const transform = (d: string): string => d;

const testData = {
    part1: ['1, 2', '2, 3', '5, 4'],
    part2: [``]
};

const testAnswers = {
    part1: [18749137, 16929656, 6899651],
    part2: [0]
};

export { transform, testData, testAnswers };