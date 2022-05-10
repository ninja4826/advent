import { transforms } from 'advent-of-code-client';
import { logger } from '../util';

import { Computer } from '../util/intcode';

export function part1(input: number[]): number | string {
    // Computer.reset(input);
    // Computer.run();
    // let outputs = Computer.outputs.slice(0);
    // let cnt = 0;
    // for (let i = 2; i < outputs.length; i += 3) {
    //     if (outputs[i] == 2) {
    //         cnt++;
    //     }
    // }
    // return cnt;

    let comp = new Computer(input);
    let output: number[] = [];

    while (!comp.halted()) {
        output.push(comp.output());
    }

    output.pop();

    let i = 2;
    let result = 0;
    while (i < output.length) {
        (output[i] == 2 && result++);
        i += 3;
    }

    return result;
}

export function part2(input: any): number | string {
    // input[0] = 2;
    // Computer.reset(input);

    // let inputFunc = (): number => {
    //     if (Computer.outputs.length === 0) return 0;

    //     let outputs = Computer.outputs.slice(0);

    //     let chunks: number[][] = [];

    //     for (let i = 0; i < outputs.length; i += 3) {
    //         chunks.push(outputs.slice(i, i + 3));
    //     }

    //     let score = chunks.filter((p) => p[0] == -1 && p[1] == 0)[0];

    //     logger.log('SCORE', score);

    //     let ball = chunks.filter((p) => p[2] == 4)[0];
    //     let paddle = chunks.filter((p) => p[2] == 3)[0];

    //     let joystick = 0;
    //     if (ball && paddle) {
    //         if (ball[0] < paddle[0]) {
    //             joystick = -1;
    //         }
    //         if (ball[0] > paddle[0]) {
    //             joystick = 1;
    //         }
    //         logger.log('MOVING JOYSTICK', joystick);
    //         Computer.outputs = [];
    //     }
    //     return joystick;
    // };
    // Computer.runFromCb(inputFunc);
    // // let outputs = Computer.outputs.slice(0);
    // // logger.log(outputs);
    // return 0;

    let comp = new Computer(input);

    let ballX: number = 0;
    let padX: number = 0;
    let score: number = 0;

    while (!comp.halted()) {
        const x = comp.output();
        const y = comp.output();
        const c = comp.output();

        if (x == -1 && y == 0) {
            score = c;
        } else if (c == 3) {
            padX = x;
            comp.input(Math.sign(ballX - padX), true);
        } else if (c == 4) {
            ballX = x;
            comp.input(Math.sign(ballX - padX), true);
        }
    }

    return score;
}

const transform = (data: string): number[] => data.split(',').map(c => parseInt(c));

const testData = {
    part1: '',
    part2: ''
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };