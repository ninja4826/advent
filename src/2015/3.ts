import { transforms } from 'advent-of-code-client';
// import { logger, matcher, progBar } from '../util';

export function part1(input: string[]): number | string {
    let delivered: Set<string> = new Set(['0,0']);

    let [x, y] = [0, 0];
    for (let inp of input) {
        switch (inp) {
            case '^':
                y += 1;
                break;
            case 'v':
                y -= 1;
                break;
            case '>':
                x += 1;
                break;
            case '<':
                x -= 1;
                break;
        }
        delivered.add(`${x},${y}`);
    }
    return delivered.size;
}

export function part2(input: string[]): number | string {
    let delivered: Set<string> = new Set(['0,0']);

    let x = [0, 0];
    let y = [0, 0];
    // for (let inp of input) {
    for (let i = 0; i < input.length; i++) {
        const inp = input[i];
        switch (inp) {
            case '^':
                y[i % 2] += 1;
                break;
            case 'v':
                y[i % 2] -= 1;
                break;
            case '>':
                x[i % 2] += 1;
                break;
            case '<':
                x[i % 2] -= 1;
                break;
        }
        delivered.add(`${x[i % 2]},${y[i % 2]}`);
    }
    return delivered.size;
}

// const transform = transforms.lines;
const transform = (d: string): string[] => d.split('');

const testData = {
    part1: ['>', '^>v<', '^v^v^v^v^v'],
    part2: ['^v', '^>v<', '^v^v^v^v^v']
};

const testAnswers = {
    part1: [2, 4, 2],
    part2: [3, 3, 11]
};

export { transform, testData, testAnswers };