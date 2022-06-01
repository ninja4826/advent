import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar, zip } from '../util';

export function part1(_input: string[]): number | string {
    const input = _input.map(i => i.split(''));
    var y = Math.floor(input.length / 2);
    var x = Math.floor(input[0].length / 2);
    logger.log(`${x},${y}`);
    var dir = 0;

    const moveForward = () => {
        if (dir == 0) y--;
        if (dir == 1) x++;
        if (dir == 2) y++;
        if (dir == 3) x--;
    };

    let grid: Set<string> = new Set();

    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            if (input[i][j] == '#') {
                grid.add(`${j},${i}`);
            }
        }
    }

    let iter = 10000;
    let counter = 0;

    for (let i = 0; i < iter; i++) {
        if (grid.has(`${x},${y}`)) {
            dir += 1;
            dir = dir % 4;
            grid.delete(`${x},${y}`);
        } else {
            dir -= 1;
            if (dir < 0) {
                dir = dir + 4;
            }
            dir = dir % 4;
            grid.add(`${x},${y}`);
            counter++;
        }
        moveForward();
        // logger.log(`${x},${y}`);
    }

    return counter;
}

export function part2(_input: string[]): number | string {
    const input = _input.map(i => i.split(''));
    var y = Math.floor(input.length / 2);
    var x = Math.floor(input[0].length / 2);
    logger.log(`${x},${y}`);
    var dir = 0;

    const moveForward = () => {
        if (dir == 0) y--;
        if (dir == 1) x++;
        if (dir == 2) y++;
        if (dir == 3) x--;
    };

    // let grid: Set<string> = new Set();
    let grid: Map<string, State> = new Map();

    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            if (input[i][j] == '#') {
                // grid.add(`${j},${i}`);
                grid.set(`${j},${i}`, State.I);
            }
        }
    }

    let iter = 10000000;
    let counter = 0;

    const b1 = progBar('Sporifica', iter);

    for (let i = 0; i < iter; i++) {
        let loc = `${x},${y}`;

        if (grid.has(loc)) {
            let state = <State>grid.get(loc);
            if (state == State.W) {
                grid.set(loc, State.I);
                counter++;
            }
            if (state == State.I) {
                dir += 1;
                dir = dir % 4;
                grid.set(loc, State.F);
            }
            if (state == State.F) {
                dir += 2;
                dir = dir % 4;
                grid.delete(loc);
            }
        } else {
            dir -= 1;
            if (dir < 0) {
                dir = dir + 4;
            }
            dir = dir % 4;
            grid.set(loc, State.W);
        }
        moveForward();
        if (i % 1000 == 0) b1.update(i);
        // logger.log(`${x},${y}`);
    }

    b1.stop();

    return counter;
}

enum State {
    W,
    I,
    F
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`..#
#..
...`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };