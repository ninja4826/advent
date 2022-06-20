import { transforms } from 'advent-of-code-client';

export function part1(input: string[][]): number | string {
    const iter = 100;
    let num = input.length - 1;
    let original = input.slice(1);

    const doOn = (j: number, k: number): string => {
        let count = 0;
        for (let dj = -1; dj < 2; dj++) {
            if (dj + j < 0 || dj + j > num) continue;
            for (let dk = -1; dk < 2; dk++) {
                if (dk + k < 0 || dk + k > num) continue;
                if (dj === 0 && dk === 0) continue;
                if (original[dj+j][dk+k] == '#') {
                    count += 1;
                }
            }
        }
        // console.log(`${k},${j}`, original[j][k]);
        // console.log(count);
        if (original[j][k] === '#') {
            return count === 2 || count === 3 ? '#' : '.';
        }
        return count === 3 ? '#' : '.';
    };

    for (let i = 0; i < iter; i++) {
        original = input.map(l => l.slice(0));
        for (let j = 0; j < input.length; j++) {
            for (let k = 0; k < input.length; k++) {
                input[j][k] = doOn(j, k);
            }
        }
    }
    return input.flat(2).filter(i => i === '#').length;
}

export function part2(input: string[][]): number | string {
    const iter = 100;
    let num = input.length - 1;
    let original: string[][];

    const doOn = (j: number, k: number): string => {
        let count = 0;
        for (let dj = -1; dj < 2; dj++) {
            if (dj + j < 0 || dj + j > num) continue;
            for (let dk = -1; dk < 2; dk++) {
                if (dk + k < 0 || dk + k > num) continue;
                if (dj === 0 && dk === 0) continue;
                if (original[dj+j][dk+k] == '#') {
                    count += 1;
                }
            }
        }
        // console.log(`${k},${j}`, original[j][k]);
        // console.log(count);

        if (original[j][k] === '#') {
            return count === 2 || count === 3 ? '#' : '.';
        }
        return count === 3 ? '#' : '.';
    };

    let corners = [
        [0, 0],
        [0, num],
        [num, 0],
        [num, num]
    ];

    for (let [l, m] of corners) {
        input[l][m] = '#';
    }

    for (let i = 0; i < iter; i++) {
        original = input.map(l => l.slice(0));
        for (let j = 0; j < input.length; j++) {
            for (let k = 0; k < input.length; k++) {
                input[j][k] = doOn(j, k);
            }
        }

        for (let [l, m] of corners) {
            input[l][m] = '#';
        }
    }
    return input.flat(2).filter(i => i === '#').length;
}

// const transform = transforms.lines;
const transform = (d: string): string[][] => d.split('\n').map(d2 => d2.split(''));

const testData = {
    part1: [`.#.#.#
...##.
#....#
..#...
#.#..#
####..`],
    part2: [``]
};

const testAnswers = {
    part1: [4],
    part2: [17]
};

export { transform, testData, testAnswers };