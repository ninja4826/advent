import { transforms } from 'advent-of-code-client';
// import { logger, matcher, progBar } from '../util';

export function part1(input: string[]): number | string {
    let floor = 0;

    for (let inp of input) {
        if (inp == '(') {
            floor += 1;
        } else {
            floor -= 1;
        }
    }
    return floor;
}

export function part2(input: string[]): number | string {
    let floor = 0;
    
    for (let i = 0; i < input.length; i++) {
        const inp = input[i];
        if (inp == '(') {
            floor += 1;
        } else {
            floor -= 1;
        }
        if (floor < 0) {
            return i + 1;
        }
    }
    return 0;
}

// const transform = transforms.lines;
const transform = (d: string): string[] => d.split('');

const testData = {
    part1: ['(())', '()()', '(((', '(()(()(', '))(((((', '())', '))(', ')))', ')())())'],
    part2: [')', '()())']
};

const testAnswers = {
    part1: [0, 0, 3, 3, 3, -1, -1, -3, -3],
    part2: [1, 5]
};

export { transform, testData, testAnswers };