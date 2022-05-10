import { transforms } from 'advent-of-code-client';
import { logger } from '../util';

// import { intCode } from '../intcode';
import { Computer } from '../util/intcode';

export function part1(input: number[]): number | string {
    // input[1] = 12;
    // input[2] = 2;
    // // let [out,] = intCode(input);
    // Computer.addOp(Op1, Op2);
    // Computer.reset(input);
    // Computer.run();
    // return Computer.data[0];

    // return out[0];

    input[1] = 12;
    input[2] = 2;

    let comp = new Computer(input);
    return comp.output();
}

export function part2(input: any): number | string {
    // for (let i = 0; i < 100; i++) {
    //     for (let j = 0; j < 100; j++) {
    //         let data = input.slice(0);
    //         data[1] = i;
    //         data[2] = j;
    //         let [out,] = intCode(data);
    //         if (out[0] === 19690720) {
    //             return (i * 100) + j;
    //         }
    //     }
    // }
    // Computer.addOp(Op1, Op2);
    // for (let i = 0; i < 100; i++) {
    //     for (let j = 0; j < 100; j++) {
    //         let data = input.slice(0);
    //         data[1] = i;
    //         data[2] = j;
    //         Computer.reset(data);
    //         Computer.run();
    //         if (Computer.data[0] === 19690720) {
    //             return (i * 100) + j;
    //         }
    //     }
    // }
    // return 0;

    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 100; j++) {
            let data = input.slice(0);
            data[1] = i;
            data[2] = j;

            let comp = new Computer(data);
            if (comp.output() === 19690720) {
                return (i * 100) + j;
            }
        }
    }

    return 0;
}

const transform = (data: string): number[] => data.split(',').map(c => parseInt(c));

const testData = {
    part1: '1,9,10,3,2,3,11,0,99,30,40,50,68',
    part2: ''
};

const testAnswers = {
    part1: 3500,
    part2: 0
};

export { transform, testData, testAnswers };