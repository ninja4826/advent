import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(input: string[]): number | string {

    let genA = genFunc(+input[0].split(' ')[4], 16807);
    let genB = genFunc(+input[1].split(' ')[4], 48271);
    let count = 0;
    
    const b1 = progBar('Generators', 40000000);

    for (let i = 0; i < 40000000; i++) {
        if (genA.next().value == genB.next().value) {
            count++;
        }
        if (i % 40000 == 0) {
            b1.update(i);
        } 
    }
    b1.stop();
    return count;
}

export function part2(input: string[]): number | string {

    let genA = genFunc2(+input[0].split(' ')[4], 16807, 4);
    let genB = genFunc2(+input[1].split(' ')[4], 48271, 8);
    let count = 0;
    
    const b1 = progBar('Generators', 5000000);

    for (let i = 0; i < 5000000; i++) {
        if (genA.next().value == genB.next().value) {
            count++;
        }
        if (i % 40000 == 0) {
            b1.update(i);
        } 
    }
    b1.stop();
    return count;
}

function *genFunc(start: number, factor: number): Generator<string, string, string> {
    let num = start;

    while (true) {
        num = (num * factor) % 2147483647;
        yield num.toString(2).split('').slice(-16).join('');
    }
}

function *genFunc2(start: number, factor: number, crit: number): Generator<string, string, string> {
    let num = start;

    while (true) {
        num = (num * factor) % 2147483647;
        if (num % crit == 0) yield num.toString(2).split('').slice(-16).join('');
    }
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`Generator A starts with 65
Generator B starts with 8921`],
    part2: [`Generator A starts with 65
Generator B starts with 8921`]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };