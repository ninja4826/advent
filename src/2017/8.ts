import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(_input: string[]): number | string {
    const input = _input.map(i => i.split(' '));
    // let registers: any = {};
    let registers: Map<string, number> = new Map();

    for (let inp of input) {
        let regKey = inp[0];
        let inc = inp[1] == 'inc' ? 1 : -1;
        let incNum = +inp[2];
        let regCheck = inp[4];
        let logic = inp[5];
        let checkNum = +inp[6];

        if (!(regKey in registers)) {
            // registers[regKey] = 0;
            registers.set(regKey, 0);
        }

        let val = 0;
        if (registers.has(regCheck)) {
            // val = registers[regCheck];
            val = <number>registers.get(regCheck);
        }

        let check = false;

        switch (logic) {
            case '>':
                check = val > checkNum;
                break;
            case '<':
                check = val < checkNum;
                break;
            case '>=':
                check = val >= checkNum;
                break;
            case '<=':
                check = val <= checkNum;
                break;
            case '==':
                check = val == checkNum;
                break;
            case '!=':
                check = val != checkNum;
                break;
        }

        if (check) {
            registers.set(regKey, <number>registers.get(regKey) + (incNum * inc));
        }
    }
    
    return Math.max(...registers.values());
}

export function part2(_input: string[]): number | string {
    const input = _input.map(i => i.split(' '));
    // let registers: any = {};
    let registers: Map<string, number> = new Map();

    let max = 0;

    for (let inp of input) {
        let regKey = inp[0];
        let inc = inp[1] == 'inc' ? 1 : -1;
        let incNum = +inp[2];
        let regCheck = inp[4];
        let logic = inp[5];
        let checkNum = +inp[6];

        if (!(regKey in registers)) {
            // registers[regKey] = 0;
            registers.set(regKey, 0);
        }

        let val = 0;
        if (registers.has(regCheck)) {
            // val = registers[regCheck];
            val = <number>registers.get(regCheck);
        }

        let check = false;

        switch (logic) {
            case '>':
                check = val > checkNum;
                break;
            case '<':
                check = val < checkNum;
                break;
            case '>=':
                check = val >= checkNum;
                break;
            case '<=':
                check = val <= checkNum;
                break;
            case '==':
                check = val == checkNum;
                break;
            case '!=':
                check = val != checkNum;
                break;
        }

        if (check) {
            registers.set(regKey, <number>registers.get(regKey) + (incNum * inc));
        }
        max = Math.max(max, ...registers.values());
    }
    return max;
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`b inc 5 if a > 1
a inc 1 if b < 5
c dec -10 if a >= 1
c inc -20 if c == 10`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };