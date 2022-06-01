import { transforms } from 'advent-of-code-client';
// import { logger, matcher, progBar, zip } from '../util';

export function part1(input: string[]): number | string {
    let keypad: number[][] = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ];

    let coords = [1, 1];
    let passcode: number[] = [];
    for (let _inp of input) {
        let inp = _inp.split('');
        for (let d of inp) {
            if (d == 'U') coords[0]--;
            if (d == 'D') coords[0]++;
            if (d == 'L') coords[1]--;
            if (d == 'R') coords[1]++;

            if (coords[0] < 0) coords[0] = 0;
            if (coords[1] < 0) coords[1] = 0;

            if (coords[0] > 2) coords[0] = 2;
            if (coords[1] > 2) coords[1] = 2;
        }
        passcode.push(keypad[coords[0]][coords[1]]);
    }
    return passcode.join('');
}

export function part2(input: string[]): number | string {
    let keypad: string[][] = [
        ['', '', '1', '', ''],
        ['', '2', '3', '4', ''],
        ['5', '6', '7', '8', '9'],
        ['', 'A', 'B', 'C', ''],
        ['', '', 'D', '', '']
    ];

    let minMaxes: [number, number][] = [
        [2, 2],
        [1, 3],
        [0, 4],
        [1, 3],
        [2, 2]
    ];

    let coords = [2, 0];
    let passcode: string[] = [];

    for (let _inp of input) {
        let inp = _inp.split('');
        for (let d of inp) {
            let dir = [0, 0];
            if (d == 'U') dir = [-1, 0];
            if (d == 'D') dir = [1, 0];
            if (d == 'L') dir = [0, -1];
            if (d == 'R') dir = [0, 1];

            let newCoords = coords.map((c, i) => c+dir[i]);

            if (newCoords[0] >= minMaxes[coords[1]][0] && newCoords[0] <= minMaxes[coords[1]][1]) {
                if (newCoords[1] >= minMaxes[coords[0]][0] && newCoords[1] <= minMaxes[coords[0]][1]) {
                    coords = newCoords;
                }
            }

            // if (coords[0] < 0) coords[0] = 0;
            // if (coords[1] < 0) coords[1] = 0;

            // if (coords[0] > 2) coords[0] = 2;
            // if (coords[1] > 2) coords[1] = 2;
        }
        passcode.push(keypad[coords[0]][coords[1]]);
    }
    return passcode.join('');
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`ULL
RRDDD
LURDL
UUUUD`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };