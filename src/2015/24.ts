import { transforms } from 'advent-of-code-client';
import { range } from '../util';
const Deque = require('collections/deque');

export function part1(input: number[]): number | string {
    return solve(input, 3);
}

export function part2(input: number[]): number | string {
    return solve(input, 4);
}

function solve(data: number[], groups: number): number {
    let goal = Math.floor(data.reduce((p, c) => p+c, 0) / groups);

    let solutions: [number, number][] = [];

    const aux = (presents: number[], score: number, used: number, qe: number): void => {
        if (score === goal) {
            solutions.push([used, qe]);
        } else if (score < goal && presents.length > 0 && used < 6) {
            aux(presents.slice(1), score, used, qe);
            aux(presents.slice(1), score + presents[0], used + 1, qe * presents[0]);
        }
    };

    aux(data, 0, 0, 1);
    solutions = [...new Set(solutions)];
    solutions.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);

    return solutions[0][1];
}

// const transform = transforms.lines;
const transform = (d: string): number[] => d.split('\n').map(Number);

const testData = {
    part1: [[...range([1, 6]), ...range([7, 12])].join('\n')],
    part2: [``]
};

const testAnswers = {
    part1: [99],
    part2: [0]
};

export { transform, testData, testAnswers };