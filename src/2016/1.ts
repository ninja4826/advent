import { transforms } from 'advent-of-code-client';
// import { logger, matcher, progBar, zip } from '../util';

export function part1(_input: string): number | string {
    let direction = 0;

    const turn = (dir: string) => {
        if (dir == 'R') {
            direction += 1;
        } else if (dir == 'L') {
            direction -= 1;
            if (direction < 0) {
                direction = direction + 4;
            }
        } else {
            throw 'Unhandled turn direction '+dir;
        }
        direction = direction % 4;
    };
    let coords = [0, 0];
    const walk = (steps: number) => {
        if (direction == 0) coords[1] += steps;
        if (direction == 1) coords[0] += steps;
        if (direction == 2) coords[1] -= steps;
        if (direction == 3) coords[0] -= steps;
    };

    const input = _input.split(', ');

    for (let _inp of input) {
        let inp = _inp.split('');
        let dir = <string>inp.shift();
        let steps = +inp.join('');
        turn(dir);
        walk(steps);
    }

    return Math.abs(coords[0]) + Math.abs(coords[1]);
}

export function part2(_input: string): number | string {
    let direction = 0;

    const turn = (dir: string) => {
        if (dir == 'R') {
            direction += 1;
        } else if (dir == 'L') {
            direction -= 1;
            if (direction < 0) {
                direction = direction + 4;
            }
        } else {
            throw 'Unhandled turn direction '+dir;
        }
        direction = direction % 4;
    };
    let coords = [0, 0];
    const walk = (steps: number) => {
        if (direction == 0) coords[1] += steps;
        if (direction == 1) coords[0] += steps;
        if (direction == 2) coords[1] -= steps;
        if (direction == 3) coords[0] -= steps;
    };

    const hist: Set<string> = new Set();

    const coordString = (): string => `${coords[0]},${coords[1]}`;
    const addHist = () => hist.add(coordString());

    addHist();

    const input = _input.split(', ');

ot: while (true) {
        for (let _inp of input) {
            let inp = _inp.split('');
            let dir = <string>inp.shift();
            let steps = +inp.join('');
            turn(dir);
            for (let i = 0; i < steps; i++) {
                walk(1);
                if (hist.has(coordString())) {
                    break ot;
                }
                // console.log(coords);
                addHist();
            }
        }
    }
    return Math.abs(coords[0]) + Math.abs(coords[1]);
}

const transform = (d: string): string => d;

const testData = {
    part1: ['R2, L3', 'R2, R2, R2', 'R5, L5, R5, R3'],
    part2: [`R8, R4, R4, R8`]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };