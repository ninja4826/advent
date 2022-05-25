import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(input: string[]): number | string {
    let insts = parse(input);

    return dance(insts, 'abcdefghijklmnop');
}

export function part2(input: string[]): number | string {
    let insts = parse(input);
    let dancers = 'abcdefghijklmnop';
    let orig = 'abcdefghijklmnop';
    // dancers = 'abcde';
    let iters = 1000000000;
    // iters = 2;
    return longDance(insts, dancers, orig, iters);
}

function parse(inst: string[]): [string, string[]][] {
    let parsed: [string, string[]][] = [];
    for (let ins of inst) {
        let op = ins[0];
        let rest = ins.slice(1);
        switch (op) {
            case 's':
                parsed.push([op, [ rest ]]);
                break;
            case 'x':
            case 'p':
                parsed.push([op, rest.split('/')]);
                break;
        }
    }
    return parsed;
}

function dance(inst: [string, string[]][], _dancers: string): string {
    let dancers = _dancers.split('');

    for (let [op, rest] of inst) {
        switch (op) {
            case 's':
                let num = +rest;
                for (let i = 0; i < num; i++) {
                    dancers.unshift(<string>dancers.pop());
                }
                break;
            case 'x':
                let xPos = rest.map(Number);
                let xAVal = dancers[xPos[0]];
                let xBVal = dancers[xPos[1]];
                dancers[xPos[0]] = xBVal;
                dancers[xPos[1]] = xAVal;
                break;
            case 'p':
                let pAPos = dancers.indexOf(rest[0]);
                let pBPos = dancers.indexOf(rest[1]);
                dancers[pAPos] = rest[1];
                dancers[pBPos] = rest[0];
                break;
        }
    }

    return dancers.join('');
}

function longDance(inst: [string, string[]][], dancers: string, orig: string, iterations = 1000000000): string {
    let seen: string[] = [dancers];

    const b1 = progBar('Promenade', iterations);

    for (let i = 0; i < iterations; i++) {
        dancers = dance(inst, dancers);
        if (dancers == orig) {
            console.log(orig);
            console.log(orig);
            b1.stop();
            return seen[iterations % i];
        }
        seen.push(dancers);

        if (i % 1000 == 0) {
            b1.update(i);
        }
    }
    b1.stop();
    return dancers;
}

const transform = (d: string): string[] => d.split(',');
// const transform = (d: string): string => d;

const testData = {
    part1: [`s1,x3/4,pe/b`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };