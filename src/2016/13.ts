import { transforms } from 'advent-of-code-client';
// import { logger, matcher, progBar } from '../util';
const Deque = require('collections/deque');
import { breadth } from '../util/path_find';

type Move = [[number, number], number];

export function part1(input: number): number | string {
    const target: [number, number] = [31, 39];

    if (input === 10) {
        target[0] = 7;
        target[1] = 4;
    }
    const start: Move = [[1, 1, ], 0];
    
    const hasher = (d: Move): string => `${d[0][0]},${d[0][1]}`;
    const tester = (d: Move): boolean => d[0][0] === target[0] && d[0][1] === target[1];
    const nexter = (d: Move, que: any): void => getNeighbors(d[0][0], d[0][1], input).forEach(v => que.push([v, d[1] + 1]));

    const ret = breadth([start], hasher, tester, nexter);

    if (ret === null) {
        return 0;
    }
    return ret[1];
    // console.log(getNeighbors(3, 1, input));

    // const que = new Deque([[[1, 1], 0]]);
    // const seen: Set<string> = new Set();

    // while (que.length > 0) {
    //     let [[x, y], score] = que.shift();

    //     let hash = `${x},${y}:${score}`;

    //     if (seen.has(hash)) continue;

    //     seen.add(hash);

    //     if (x === target[0] && y === target[1]) {
    //         return score;
    //     }

    //     let neighbors = getNeighbors(x, y, input);
    //     for (let n of neighbors) {
    //         que.push([n, score + 1]);
    //     }
    // }
    // return 0;
}

export function part2(input: number): number | string {
    // const target: [number, number] = [31, 39];

    // if (input === 10) {
    //     target[0] = 7;
    //     target[1] = 4;
    // }
    const start: Move = [[1, 1, ], 0];

    let counter = 0;

    const hasher = (d: Move): string => `${d[0][0]},${d[0][1]}`;
    const tester = (d: Move): boolean => d[1] > 50;
    const nexter = (d: Move, que: any): void => {
        if (d[1] < 51) counter++;
        getNeighbors(d[0][0], d[0][1], input).forEach(v => que.push([v, d[1] + 1]));
    };

    const ret = breadth([start], hasher, tester, nexter);
    if (ret === null) {
        return 0;
    }
    return counter;
}

interface Marker {
    coords: [number, number];
    score: number;
}

function getNeighbors(ox: number, oy: number, input: number): [number, number][] {
    let n: [number, number][] = [
        [ox+1, oy],
        [ox, oy-1],
        [ox-1, oy],
        [ox, oy+1]
    ].filter((v) => {
        let [x, y] = v;
        if (x < 0 || y < 0) return false;
        let res = (Math.pow(x, 2)) + (3 * x) + (2 * x * y) + y + (Math.pow(y, 2));
        res += input;
        res = res.toString(2).split('').filter(b => b == '1').length;
        return res % 2 == 0;
    }).map(e => [e[0], e[1]]);

    return n;
}

// const transform = transforms.lines;
const transform = (d: string): number => +d;

const testData = {
    part1: [`10`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };