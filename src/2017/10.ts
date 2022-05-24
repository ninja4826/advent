import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';
import { Knot } from './knot';

export function part1(_input: string): number | string {
    const input = _input.split(',').map(Number);
    let currPos = 0;
    let skip = 0;
    let ring: number[] = [];
    for (let i = 0; i < 256; i++) {
    // for (let i = 0; i < 5; i++) {
        ring.push(i);
    }
    for (let inp of input) {
        let targetIDs: number[] = [];
        let targetVals: number[] = [];
        for (let i = currPos; i < currPos + inp; i++) {
            targetIDs.push(i % ring.length);
            targetVals.push(ring[i % ring.length]);
        }

        targetIDs.reverse();
        for (let i = 0; i < targetIDs.length; i++) {
            ring[targetIDs[i]] = targetVals[i];
        }

        currPos += inp + skip;
        skip++;
    }
    console.log(ring);
    return ring[0] * ring[1];
}

export function part2(_input: string): number | string {
    return (new Knot(_input)).hex;
}

// const transform = (d: string): number[] => d.split(',').map(Number);
const transform = (d: string): string => d;

const testData = {
    part1: [`3,4,1,5`],
    part2: [``, 'AoC 2017', '1,2,3', '1,2,4']
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };