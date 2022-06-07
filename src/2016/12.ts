import { transforms } from 'advent-of-code-client';
// import { logger, matcher, progBar } from '../util';

export function part1(input: string[]): number | string {
    const registers: Map<string, number> = new Map();

    for (let inp of input) {
        let split = inp.split(' ').slice(1);
        for (let s of split) {
            if (isNaN(Number(s))) {
                registers.set(s, 0);
            }
        }
    }
    for (let i = 0; i < input.length; i++) {
        // console.log(i, registers);
        const inp = input[i];
    // for (let inp of input) {
        let split: (string | number)[] = inp.split(' ').map(j => isNaN(Number(j)) ? j : Number(j));

        switch (split[0]) {
            case 'cpy':
                if (typeof split[1] == 'string') {
                    registers.set(<string>split[2], <number>registers.get(split[1]));
                } else {
                    registers.set(<string>split[2], split[1]);
                }
                break;
            case 'inc':
                registers.set(<string>split[1], <number>registers.get(<string>split[1]) + 1);
                break;
            case 'dec':
                registers.set(<string>split[1], <number>registers.get(<string>split[1]) - 1);
                break;
            case 'jnz':
                if (<number>registers.get(<string>split[1]) !== 0) {
                    i += (<number>split[2]) - 1;
                }
                break;
        }
    }
    return <number>registers.get('a');
}

export function part2(input: string[]): number | string {
    const registers: Map<string, number> = new Map();

    for (let inp of input) {
        let split = inp.split(' ').slice(1);
        for (let s of split) {
            if (isNaN(Number(s))) {
                registers.set(s, 0);
            }
        }
    }
    registers.set('c', 1);
    for (let i = 0; i < input.length; i++) {
        // console.log(i, registers);
        const inp = input[i];
    // for (let inp of input) {
        let split: (string | number)[] = inp.split(' ').map(j => isNaN(Number(j)) ? j : Number(j));

        switch (split[0]) {
            case 'cpy':
                if (typeof split[1] == 'string') {
                    registers.set(<string>split[2], <number>registers.get(split[1]));
                } else {
                    registers.set(<string>split[2], split[1]);
                }
                break;
            case 'inc':
                registers.set(<string>split[1], <number>registers.get(<string>split[1]) + 1);
                break;
            case 'dec':
                registers.set(<string>split[1], <number>registers.get(<string>split[1]) - 1);
                break;
            case 'jnz':
                if (<number>registers.get(<string>split[1]) !== 0) {
                    i += (<number>split[2]) - 1;
                }
                break;
        }
    }
    return <number>registers.get('a');
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`cpy 41 a
inc a
inc a
dec a
jnz a 2
dec a`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };