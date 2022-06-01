import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar, zip } from '../util';

export function part1(input: string[]): number | string {

    let states: Map<string, [State, State]> = new Map();

    for (let i = 3; i < input.length; i += 10) {
        let arr = input.slice(i, i + 10);
        let name = arr[0].split(' ')[2].split(':')[0];

        let state1: State = {
            writeVal: +arr[2].split(' ')[8].split('.')[0],
            moveDir: arr[3].split(' ')[10] == 'right.' ? 1 : -1,
            nextState: arr[4].split(' ')[8].split('.')[0]
        };

        let state2: State = {
            writeVal: +arr[6].split(' ')[8].split('.')[0],
            moveDir: arr[7].split(' ')[10] == 'right.' ? 1 : -1,
            nextState: arr[8].split(' ')[8].split('.')[0]
        };

        states.set(name, [state1, state2]);
    }

    let currState = input[0].split(' ')[3].split('.')[0];

    let iter = +input[1].split(' ')[5];

    const b1 = progBar('Turing', iter);

    let strip: Map<number, number> = new Map();
    let cursor = 0;

    for (let i = 0; i < iter; i++) {
        let val = 0;
        if (strip.has(cursor)) {
            val = <number>strip.get(cursor);
        }
        let state = (<[State, State]>states.get(currState))[val];

        strip.set(cursor, state.writeVal);
        cursor += state.moveDir;
        currState = state.nextState;
        b1.update(i+1);
    }

    b1.stop();

    return [...strip.values()].filter(v => v == 1).reduce((p, c) => p+c, 0);
}

export function part2(input: string[]): number | string {
    return 0;
}

interface State {
    writeVal: number;
    moveDir: number;
    nextState: string;
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`Begin in state A.
Perform a diagnostic checksum after 6 steps.

In state A:
    If the current value is 0:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state B.
    If the current value is 1:
    - Write the value 0.
    - Move one slot to the left.
    - Continue with state B.

In state B:
    If the current value is 0:
    - Write the value 1.
    - Move one slot to the left.
    - Continue with state A.
    If the current value is 1:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state A.`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };