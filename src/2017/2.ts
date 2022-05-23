import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(_input: string[]): number | string {
    const input = _input.map(i => i.split('\t').map(Number));
    const minMaxes = input.map(c => [Math.max(...c), Math.min(...c)]);
    const checkSums = minMaxes.map(c => c[0] - c[1]);

    return checkSums.reduce((p, c) => p+c, 0);
}

export function part2(_input: string[]): number | string {
    const input = _input.map(i => i.split('\t').map(Number));
    const checkSums: number[] = [];

out:for (let inp of input) {
        for (let i = 0; i < inp.length; i++) {
            for (let j = 0; j < inp.length; j++) {
                if (i === j) continue;
                if (inp[i] % inp[j] === 0) {
                    checkSums.push(inp[i] / inp[j]);
                    continue out;
                }
            }
        }
    }

    return checkSums.reduce((p, c) => p+c, 0);
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`5\t1\t9\t5
7\t5\t3
2\t4\t6\t8`],
    part2: [`5\t9\t2\t8
9\t4\t7\t3
3\t8\t6\t5`]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };