import { transforms } from 'advent-of-code-client';
import { logger } from '../util';

// import { intCode } from '../intcode';
import { Computer } from '../util/intcode';

export function part1(input: any): number | string {
    // let [,out] = intCode(input, 1);
    // Computer.addOp(Op1, Op2, Op3, Op4, Op5, Op6, Op7, Op8);
    // Computer.reset(input);
    // Computer.run(1);
    // return Computer.outputs.slice(-1)[0];
    let comp = new Computer(input);
    return comp.input(1).finalOutput();
}

export function part2(input: any): number | string {
    // let [,out] = intCode(input, 5);
    // Computer.addOp(Op1, Op2, Op3, Op4, Op5, Op6, Op7, Op8);
    // Computer.reset(input);
    // Computer.run(5);
    // return Computer.outputs.slice(-1)[0];
    let comp = new Computer(input);
    return comp.input(5).finalOutput();
}

const transform = (data: string): number[] => data.split(',').map(c => parseInt(c));

const testData = {
    part1: '1002,4,3,4,33',
    part2: '3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99'
};

const testAnswers = {
    part1: 0,
    part2: 1001
};

export { transform, testData, testAnswers };