import { transforms } from 'advent-of-code-client';
import { range } from '../util';

export function part1(input: number): number | string {
    return solve(Math.floor(input / 10), Math.floor(input / 10));
}

export function part2(input: number): number | string {
    return solve(Math.floor(input / 11), 50);
}

function solve(target: number, limit: number): number {
    let houses: number[] = new Array(target).fill(1);
    
    for (let i of range([2, target])) {
        for (let j of range(Math.min(Math.floor(target / i), limit))) {
            houses[i * j] += i;
        }
        if (houses[i] >= target) {
            return i;
        }
    }
    console.log(houses);
    return 0;
}

// const transform = transforms.lines;
const transform = (d: string): number => +d;

const testData = {
    part1: ['70', `100`, '130'],
    part2: [``]
};

const testAnswers = {
    part1: [4, 6, 8],
    part2: [0]
};

export { transform, testData, testAnswers };