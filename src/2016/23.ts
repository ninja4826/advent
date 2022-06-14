import { transforms } from 'advent-of-code-client';
import { factorial } from '../util';
import { Assembunny } from './util';

export function part1(input: string[]): number | string {
    // let bunny = new Assembunny(input);
    // bunny.registers.set('a', 7);
    // bunny.run();

    return factorial(7) + (+input[20].split(' ')[1]) * (+input[19].split(' ')[1]);

    // return <number>bunny.registers.get('a');
}

export function part2(input: string[]): number | string {
    return factorial(12) + (+input[20].split(' ')[1]) * (+input[19].split(' ')[1]);
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`cpy 2 a
tgl a
tgl a
tgl a
cpy 1 a
dec a
dec a`],
    part2: [``]
};

const testAnswers = {
    part1: [3],
    part2: [0]
};

export { transform, testData, testAnswers };