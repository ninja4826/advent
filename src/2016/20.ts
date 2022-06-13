import { transforms } from 'advent-of-code-client';
// import { logger, matcher, progBar } from '../util';

export function part1(_input: string[]): number | string {
    const input = _input.map(i => i.split('-').map(Number));

    input.sort((a, b) => a[0] - b[0]);

    return findLowest(input)[0];
}

export function part2(_input: string[]): number | string {
    const input = _input.map(i => i.split('-').map(Number));

    input.sort((a, b) => a[0] - b[0]);

    return findLowest(input)[1];
}

function findLowest(ips: number[][]): [number, number] {
    let nrAvailable = 0;
    let lowestAvailable = 0;
    let theLowest = 0;

    for (let [low, high] of ips) {
        if (low > lowestAvailable) {
            nrAvailable += low - lowestAvailable;

            if (!theLowest) {
                theLowest = lowestAvailable;
            }
        }
        lowestAvailable = Math.max(lowestAvailable, high + 1);
    }
    return [theLowest, nrAvailable];
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`5-8
0-2
4-7`],
    part2: [``]
};

const testAnswers = {
    part1: [3],
    part2: [2]
};

export { transform, testData, testAnswers };