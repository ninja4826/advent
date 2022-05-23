import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(_input: string): number | string {
    const input = _input.split('');
    input.push(input[0]);
    let count = 0;

    for (let i = 0; i < input.length; i++) {
        if (input[i] == input[i+1]) {
            count += +input[i];
        }
    }
    return count;
}

export function part2(_input: string): number | string {
    const input = _input.split('');
    let count = 0;
    let fwd = input.length / 2;

    for (let i = 0; i < input.length; i++) {
        if (input[i] == input[(i + fwd) % input.length]) {
            count += +input[i];
        }
    }
    return count;
}

// const transform = transforms.lines;
const transform = (d: string): string => d;

const testData = {
    part1: ['1122', '1111', '1234', '91212129'],
    part2: ['1212', '1221', '123425', '123123', '12131415']
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };