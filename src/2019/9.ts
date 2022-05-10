import { transforms } from 'advent-of-code-client';
import { logger } from '../util';

// import { intCode } from '../intcode';
import { Computer } from '../util/intcode';

export function part1(input: any): number | string {
    // // let [,out] = intCode(input, 1);
    // Computer.addOp(...AllOps);
    // Computer.reset(input);
    // Computer.run(1);

    // logger.log(Computer.outputs);
    // // logger.log(out);
    // return Computer.outputs[0];

    let comp = new Computer(input);
    return comp.input(1).finalOutput();
}

export function part2(input: any): number | string {
    // Computer.addOp(...AllOps);
    // Computer.reset(input);
    // Computer.run(2);

    // return Computer.outputs[0];
    let comp = new Computer(input);
    return comp.input(2).finalOutput();
}

const transform = (data: string): number[] => data.split(',').map(c => parseInt(c));

const testData = {
    part1: '104,1125899906842624,99',
    part2: ''
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };