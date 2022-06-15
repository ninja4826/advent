import { transforms } from 'advent-of-code-client';
import { range } from '../util';

export function part1(input: string): number | string {
    let iter = 40;

    for (let i of range(iter)) {
        input = processStr(input);
    }

    // console.log(input);
    return input.length;
}

export function part2(input: string): number | string {
    let iter = 50;

    for (let i of range(iter)) {
        input = processStr(input);
    }

    // console.log(input);
    return input.length;
}

function processStr(_str: string): string {
    let counter = 0;
    let str = _str.split('');
    let prev = str[0];

    let ret: string[] = [];

    for (let s of str) {
        if (s == prev) {
            counter++;
        } else {
            ret.push(counter.toString(), prev);
            counter = 1;
            prev = s;
        }
    }

    ret.push(counter.toString(), prev);

    return ret.join('');
}

// const transform = transforms.lines;
const transform = (d: string): string => d;

const testData = {
    part1: ['1'],
    part2: [``]
};

const testAnswers = {
    part1: [6],
    part2: [0]
};

export { transform, testData, testAnswers };