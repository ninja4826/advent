import { validate } from "uuid";

export function part1(_input: string[]): any {
    const PREAMBLE_SIZE = 25;
    
    let input: number[] = _input.map(c => parseInt(c));

    let stack: number[] = [];

    for (let i = 0; i < PREAMBLE_SIZE; i++) {
        [ stack, input ] = shiftToStack(stack, input, false);
    }

    while (input.length > 0) {
        if (validateNum(input[0], stack)) {
            [stack, input] = shiftToStack(stack, input);
        } else {
            // console.log(input);
            return input[0];
        }
    }

    // console.log(stack);
    // console.log(input);
}

export function part2(_input: string[]): any {
    const PREAMBLE_SIZE = 25;

    let input: number[] = _input.map(c => parseInt(c));
    let hist: number[] = [];
    let stack: number[] = [];

    for (let i = 0; i < PREAMBLE_SIZE; i++) {
        hist.push(input[0]);
        [ stack, input ] = shiftToStack(stack, input, false);
    }

    while (input.length > 0) {
        if (validateNum(input[0], stack)) {
            hist.push(input[0]);
            [stack, input] = shiftToStack(stack, input);
        } else {
            for (let i = 2; i < hist.length; i++) {
                for (let j = 0; j+i <= hist.length; j++) {
                    let piz = hist.slice(j, j+i);
                    let tot = piz.reduce((p, c) => p+c, 0);
                    if (tot == input[0]) {
                        let min = Math.min(...piz);
                        let max = Math.max(...piz);
                        return min + max;
                    }
                }
            }
        }
    }
}

function shiftToStack(stack: number[], input: number[], doStackShift = true): [number[], number[]] {
    let n = input.shift();
    if (n == undefined) {
        throw new Error('ugh');
    }

    stack.push(n);
    if (doStackShift) {
        stack.shift();
    }
    return [stack, input];
}

function validateNum(num: number, stack: number[]): boolean {
    for (let cur1 of stack) {
        for (let cur2 of stack) {
            if ((cur1 + cur2) == num) {
                return true;
            }
        }
    }

    return false;
}