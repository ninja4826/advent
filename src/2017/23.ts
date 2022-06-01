import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar, zip } from '../util';
const cliProgress = require('cli-progress');

export function part1(input: string[]): number | string {
    logger.enable();
    let registers: { [key: string]: number } = {};
    let keys = 'abcdefgh'.split('');

    for (let k of keys) {
        registers[k] = 0;
    }

    const interpret = (val: string): number => isNaN(+val) ? registers[val] : +val;

    let i = 0;
    let count = 0;
    while (i < input.length) {
        let [op, reg, val]  = input[i].split(' ');
        if (op == 'set') {
            registers[reg] = interpret(val);
        } else if (op == 'sub') {
            registers[reg] -= interpret(val);
        } else if (op == 'mul') {
            registers[reg] *= interpret(val);
            count++;
        } else if (op == 'jnz') {
            if (interpret(reg) !== 0) {
                i += interpret(val);
                continue;
            }
        }
        i += 1;
        logger.log(count);
    }
    return count;
    // return (registers['b'] - registers['e']) * (registers['b'] - registers['d']);
}

export function part2(input: string[]): number | string {
    logger.enable();
    let registers: { [key: string]: number } = {};
    let keys = 'abcdefgh'.split('');

    for (let k of keys) {
        registers[k] = 0;
    }

    registers['a'] = 1;

    const interpret = (val: string): number => isNaN(+val) ? registers[val] : +val;

    let i = 0;
    while (i < 11) {
        let [op, reg, val] = input[i].split(' ');
        if (op == 'set') {
            registers[reg] = interpret(val);
        } else if (op == 'sub') {
            registers[reg] -= interpret(val);
        } else if (op == 'mul') {
            registers[reg] *= interpret(val);
        } else if (op == 'jnz') {
            if (interpret(reg) !== 0) {
                i += interpret(val);
                continue;
            }
        }
        i += 1;
        // logger.log(registers);
    }
    let bStart = registers['b'] + 17;
    let bEnd = registers['c'] + 1;

    const multibar = new cliProgress.MultiBar({
        clearOnComplete: false,
        hideCursor: true,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        fps: 5
    }, cliProgress.Presets.shades_grey);

    const b1 = multibar.create(bEnd - bStart, 0);

    let nonprimes = Math.floor((registers['c'] - registers['b']) / 34 + 1);
    for (let b = registers['b'] + 17; b < registers['c'] + 1; b += 34) {
        b1.update(b - bStart);
        const b2 = multibar.create(Math.pow(b, 0.5) - 3, 0);
        for (let d = 3; d < Math.pow(b, 0.5); d += 2) {
            b2.update(d);
            if (b % d == 0) {
                // nonprimes += d;
                nonprimes++;
                break;
            }
        }
        multibar.remove(b2);
    }

    multibar.stop();

    return nonprimes;
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [``],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };