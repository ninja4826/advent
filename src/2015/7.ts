import { transforms } from 'advent-of-code-client';
// import { logger, matcher, progBar } from '../util';

const KEYWORDS = ['AND', 'OR', 'NOT', 'LSHIFT', 'RSHIFT'];

export function part1(input: string[]): number | string {
    return evalWires(input);
}

export function part2(input: string[]): number | string {
    let b = evalWires(input);

    return evalWires(input, { b });
}

function evalWires(_input: string[], start: any = {}): number {
    const input: [string[], string][] = _input.map(i => i.split(' -> ')).map(s => [s[0].split(' '), s[1]]);
    

    let registers: Map<string, number> = new Map(Object.entries(start));

    const interpret = (d: string): number | undefined => isNaN(Number(d)) ? registers.get(d) : +d;

    while (true) {
        let didChange = false;

        for (let [op, k] of input) {
            if (registers.has(k)) continue;

            if (op[0] === 'NOT') {
                let val = interpret(op[1]);
                if (val != undefined) {
                    let valA = parseInt(val.toString(2)
                        .padStart(16, '0')
                        .split('')
                        .map(b => b === '0')
                        .map(b => b ? '1' : '0')
                        .join(''), 2);
                    registers.set(k, valA);
                    didChange = true;
                }
            } else if (op[1] === 'AND') {
                let val1 = interpret(op[0]);
                let val2 = interpret(op[2]);

                if (val1 != undefined && val2 != undefined) {
                    registers.set(k, val1 & val2);
                    didChange = true;
                }
            } else if (op[1] === 'OR') {
                let val1 = interpret(op[0]);
                let val2 = interpret(op[2]);

                if (val1 != undefined && val2 != undefined) {
                    registers.set(k, val1 | val2);
                    didChange = true;
                }
            } else if (op[1] === 'LSHIFT') {
                let val1 = interpret(op[0]);
                let val2 = interpret(op[2]);

                if (val1 != undefined && val2 != undefined) {
                    registers.set(k, val1 << val2);
                    didChange = true;
                }
            } else if (op[1] === 'RSHIFT') {
                let val1 = interpret(op[0]);
                let val2 = interpret(op[2]);

                if (val1 != undefined && val2 != undefined) {
                    registers.set(k, val1 >> val2);
                    didChange = true;
                }
            } else if (op.length == 1) {
                let val = interpret(op[0]);

                if (val != undefined) {
                    registers.set(k, val);
                    didChange = true;
                }
            }
        }

        if (!didChange) {
            break;
        }
    }

    // console.log(registers);
    return <number>registers.get('a');
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`123 -> x
456 -> y
x AND y -> d
x OR y -> e
x LSHIFT 2 -> f
y RSHIFT 2 -> g
NOT x -> h
NOT y -> i`],
    part2: [``]
};

const testAnswers = {
    part1: [0],
    part2: [0]
};

export { transform, testData, testAnswers };