import { transforms } from 'advent-of-code-client';
import { logger } from '../util';

import { Computer } from '../util/intcode';

export function part1(input: any): number | string {
    let comp = new Computer(input);

    let pulled: number[] = [];

    for (let i = 0; i < 50; i++) {
        for (let j = 0; j < 50; j++) {
            // pulled.push(Computer.runToOutput(i, j));
            // Computer.reset(input);
            comp.reset();
            comp.input([i, j]);
            pulled.push(comp.output());
            
        }
    }
    
    return pulled.reduce((p, c) => p+c, 0);
}

export function part2(input: number[]): number | string {
    const SHIP_DIMENSION_OFFSET = 99;

    let leftX = -1;
    let topY = -1;
    let rightX: number;
    let bottomY = topY + SHIP_DIMENSION_OFFSET;

    let comp = new Computer(input);

    do {
        bottomY++;
        topY++;
        while (isDronePulled(comp, ++leftX, bottomY) == false);
        rightX = leftX + SHIP_DIMENSION_OFFSET;
    } while (!isDronePulled(comp, rightX, topY));
    
    // return pulled.reduce((p, c) => p+c, 0);
    return (leftX * 10000) + topY;
}

function isDronePulled(comp: Computer, x: number, y: number): boolean {
    // Computer.reset(input);
    // return Computer.runToOutput(x, y) == 1;
    comp.reset();
    comp.input([ x, y ]);

    return comp.output() === 1;
}

const transform = (data: string): number[] => data.split(',').map(c => parseInt(c));

const testData = {
    part1: '109,424,203,1,21102,11,1,0,1105,1,282,21102,1,18,0,1106,0,259,2101,0,1,221,203,1,21102,1,31,0,1106,0,282,21102,38,1,0,1105,1,259,20101,0,23,2,22101,0,1,3,21101,1,0,1,21101,57,0,0,1105,1,303,2101,0,1,222,21001,221,0,3,21002,221,1,2,21101,0,259,1,21102,80,1,0,1106,0,225,21102,89,1,2,21102,91,1,0,1105,1,303,2101,0,1,223,20101,0,222,4,21101,0,259,3,21102,1,225,2,21102,225,1,1,21102,118,1,0,1106,0,225,20101,0,222,3,21101,136,0,2,21101,133,0,0,1106,0,303,21202,1,-1,1,22001,223,1,1,21101,148,0,0,1105,1,259,1202,1,1,223,20102,1,221,4,21001,222,0,3,21102,18,1,2,1001,132,-2,224,1002,224,2,224,1001,224,3,224,1002,132,-1,132,1,224,132,224,21001,224,1,1,21102,195,1,0,106,0,108,20207,1,223,2,20102,1,23,1,21101,-1,0,3,21101,214,0,0,1105,1,303,22101,1,1,1,204,1,99,0,0,0,0,109,5,1202,-4,1,249,21201,-3,0,1,22102,1,-2,2,21202,-1,1,3,21102,1,250,0,1105,1,225,21201,1,0,-4,109,-5,2105,1,0,109,3,22107,0,-2,-1,21202,-1,2,-1,21201,-1,-1,-1,22202,-1,-2,-2,109,-3,2105,1,0,109,3,21207,-2,0,-1,1206,-1,294,104,0,99,22102,1,-2,-2,109,-3,2105,1,0,109,5,22207,-3,-4,-1,1206,-1,346,22201,-4,-3,-4,21202,-3,-1,-1,22201,-4,-1,2,21202,2,-1,-1,22201,-4,-1,1,21201,-2,0,3,21102,343,1,0,1106,0,303,1105,1,415,22207,-2,-3,-1,1206,-1,387,22201,-3,-2,-3,21202,-2,-1,-1,22201,-3,-1,3,21202,3,-1,-1,22201,-3,-1,2,21202,-4,1,1,21102,384,1,0,1105,1,303,1106,0,415,21202,-4,-1,-4,22201,-4,-3,-4,22202,-3,-2,-2,22202,-2,-4,-4,22202,-3,-2,-3,21202,-4,-1,-2,22201,-3,-2,1,21202,1,1,-4,109,-5,2106,0,0',
    part2: ''
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };