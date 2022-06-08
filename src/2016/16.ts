import { transforms } from 'advent-of-code-client';
import { chunk } from '../util';
// import { logger, matcher, progBar } from '../util';

export function part1(input: string): number | string {
    const discLen = 272;
    const drag = dragon(input, discLen);
    console.log('dragon:', drag);
    const check = checksum(drag);
    console.log('checksum:', check);
    return check;
    // return checksum(dragon(input, discLen));
}

export function part2(input: string): number | string {
    const discLen = 35651584;
    return checksum(dragon(input, discLen));
}

function dragon(str: string, l: number): string {
    while (str.length < l) {
        const a = str.split('');
        const b = str.split('')
            .slice(0)
            .reverse()
            .map(v => v === '1' ? '0' : '1');
        str = a.join('') + '0' + b.join('');
    }
    return str.slice(0, l);
}

function checksum(str: string): string {
    const arr = str.split('');
    let ret: string[] = [];

    for (let [a, b] of chunk(arr, 2)) {
        if (b === undefined) ret.push('0');
        ret.push(a === b ? '1' : '0');
    }

    if (ret.length % 2 == 0) {
        return checksum(ret.join(''));
    } else {
        return ret.join('');
    }
}

// const transform = transforms.lines;
const transform = (d: string): string => d;

const testData = {
    part1: [`10000`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };