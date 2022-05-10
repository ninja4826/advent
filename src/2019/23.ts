import { transforms } from 'advent-of-code-client';
import { logger, Computer } from '../util';

export function part1(input: any): number | string {
    return runNic(input, false);
}

export function part2(input: any): number | string {
    return runNic(input, true);
}

function runNic(input: number[], p2: boolean): number {
    let nicList: Computer[] = [];

    for (let i = 0; i < 50; i++) {
        nicList.push(new Computer(input, [ i ], -1));
    }

    let natx: number = 0;
    let naty: number = 0;
    let natUpdated = false;

    const _runNic = () => {
        nicList.forEach((nic, address) => {
            const target = nic.next();

            if (target === Computer.INPUT_EVENT) {
                return;
            }

            const x = nic.next();
            const y = nic.next();

            if (target == 255) {
                natx = x;
                naty = y;
                natUpdated = true;
                return;
            }

            nicList[target].input([x, y]);
        });
    };

    _runNic();

    let part1Result: number = 0;
    let part2Result: number;
    let prevNatY = null;

    while (true) {
        _runNic();

        if (!part1Result && natUpdated) {
            part1Result = naty;
        }

        const isInputEmpty = !nicList.find(nic => !nic.isInputEmpty());

        if (isInputEmpty && natUpdated) {
            if (prevNatY == naty) {
                part2Result = naty;
                break;
            }

            prevNatY = naty;
            nicList[0].input([natx, naty]);
            natUpdated = true;
        }
    }

    if (!p2) {
        return part1Result;
    } else {
        return part2Result;
    }
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