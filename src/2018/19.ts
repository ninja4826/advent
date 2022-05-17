import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';
import { Computer } from './computer';

export function part1(input: string[]): number | string {
    const instructions = input.map(l => l.split(' '));

    let computer = new Computer();
    computer.execute(instructions);
    return computer.state[0];
}

export function part2(input: string[]): number | string {
    const instructions = input.map(l => l.split(' '));

    let computer = new Computer();
    computer.state[0] = 1;
    instructions.pop();
    let regID = Number(instructions[34][3]);
    computer.execute(instructions);
    let num = computer.state[regID];
    let set: Set<number> = new Set();
    
    for (let i = 1; i < Math.round(Math.sqrt(num) + 1); i++) {
        if (num % i === 0) {
            set.add(i);
            set.add(num / i);
        }
    }

    return [...set].reduce((p, c) => p+c, 0);
}

const transform = transforms.lines;

const testData = {
    part1: `#ip 0
seti 5 0 1
seti 6 0 2
addi 0 1 0
addr 1 2 3
setr 1 0 0
seti 8 0 4
seti 9 0 5`,
    part2: `#ip 4
addi 4 16 4
seti 1 0 2
seti 1 0 5
mulr 2 5 3
eqrr 3 1 3
addr 3 4 4
addi 4 1 4
addr 2 0 0
addi 5 1 5
gtrr 5 1 3
addr 4 3 4
seti 2 0 4
addi 2 1 2
gtrr 2 1 3
addr 3 4 4
seti 1 0 4
mulr 4 4 4
addi 1 2 1
mulr 1 1 1
mulr 4 1 1
muli 1 11 1
addi 3 3 3
mulr 3 4 3
addi 3 9 3
addr 1 3 1
addr 4 0 4
seti 0 0 4
setr 4 0 3
mulr 3 4 3
addr 4 3 3
mulr 4 3 3
muli 3 14 3
mulr 3 4 3
addr 1 3 1
seti 0 0 0
seti 0 0 4`
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };