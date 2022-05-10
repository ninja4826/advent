import { transforms } from 'advent-of-code-client';
import { logger } from '../util';

export function part1(input: any): number | string {
    let curr: number[] = input.slice(0);

    for (let i = 0; i < 100; i++) {
        let old = curr.slice(0);
        for (let j = 0; j < curr.length; j++) {
            let base = getBase(j, curr.length);
            curr[j] = parseInt(old
                .map((o: number, k: number) => o * base[k])
                .reduce((p: number, c: number) => p+c, 0)
                .toString()
                .split('')
                .reverse()[0]);
        }
    }
    return curr.slice(0, 8).join('');
}

export function part2(input: any): number | string {
    let offset = parseInt(input.slice(0, 7).join(''));

    let inp = input
        .join('')
        .repeat(10000)
        .split('')
        .map((c: string) => parseInt(c))
        .slice(offset);
    
    for (let j = 0; j < 100; j++) {
        for (let i = inp.length - 1; i >= 0; i--) {
            inp[i - 1] = (inp[i - 1] + inp[i]) % 10;
        }
    }
    return inp.slice(0, 8).join('');
}

export function oldpart2(input: any): number | string {
    let data = input.join('').repeat(10000).split('').map((c: string) => parseInt(c));

    let curr: number[] = data.slice(0);

    for (let i = 0; i < 100; i++) {
        let old = curr.slice(0);
        for (let j = 0; j < curr.length; j++) {
            let base = getBase(j, curr.length);
            curr[j] = old
                .map((o: number, k: number) => o * base[k])
                .reduce((p: number, c: number) => p+c, 0) % 10;
        }
    }

    let skip = parseInt(curr.slice(0, 7).join(''));

    return curr.slice(skip, skip+8).join('');
}

function fft1(inp: number[], phases = 100): number[] {
    let n = inp.length;
    let p = [0, 1, 0, -1];

    for (let i = 0; i < phases; i++) {
        let newList: number[] = [];

        for (let j = 0; j < n; j++) {
            let num = inp
                .map((o: number, k: number) => p[Math.floor(((k+1) / (j+1)) % 10)] * inp[k])
                .reduce((p: number, c: number) => p+c, 0);
            newList.push(Math.abs(num));
        }
        inp = newList;
    }
    return inp;
}

function getBase(num: number, len: number): number[] {
    const BASE = [0, 1, 0, -1];
    
    num++;

    let arr: number[] = [];
    while (arr.length <= len) {
        for (let b of BASE) {
            for (let i = 0; i < num; i++) {
                arr.push(b);
            }
        }
    }
    arr.shift();

    return arr;
}

const transform = (data: string): number[] => data.split('').map(c => parseInt(c));

const testData = {
    part1: '80871224585914546619083218645595',
    part2: '03036732577212944063491565474664'
};

const testAnswers = {
    part1: 24176176,
    part2: 84462026
};

export { transform, testData, testAnswers };