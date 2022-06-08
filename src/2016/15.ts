import { transforms } from 'advent-of-code-client';
// import { logger, matcher, progBar } from '../util';

export function part1(input: string[]): number | string {
    let discs: [number, number][] = [];

    for (let inp of input) {
        let split = inp.split(' ');
        discs.push([+split[3], +split[11].slice(0, -1)]);
    }

    return getTime(discs);
}

export function part2(input: string[]): number | string {
    let discs: [number, number][] = [];

    for (let inp of input) {
        let split = inp.split(' ');
        discs.push([+split[3], +split[11].slice(0, -1)]);
    }

    discs.push([11, 0]);

    return getTime(discs);
}

function getTime(discs: [number, number][]): number {
    let i = -1;
a:  while (true) {
        i++;
        for (let _j = 0; _j < discs.length; _j++) {
            const [pos, offset] = discs[_j];
            const j = _j + 1;

            if ((i + j + offset) % pos !== 0) {
                continue a;
            }
        }
        break;
    }
    return i;
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`Disc #1 has 5 positions; at time=0, it is at position 4.
Disc #2 has 2 positions; at time=0, it is at position 1.`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };