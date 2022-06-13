import { transforms } from 'advent-of-code-client';
import { breadth, HashFunc, TestFunc, NextFunc } from '../util/path_find';
import md5 from 'md5';
import { logger } from '../util';
// import { logger, matcher, progBar } from '../util';

export function part1(input: string): number | string {
    const directions: [[number, number], string][] = [
        [[0, -1], 'U'],
        [[0, 1], 'D'],
        [[-1, 0], 'L'],
        [[1, 0], 'R']
    ];

    const hashFunc: HashFunc<Move> = (d: Move): string => {
        return `${d[0][0]},${d[0][1]}:${d[1]}`;
    };

    const testFunc: TestFunc<Move> = (d: Move): boolean => {
        return d[0][0] === 3 && d[0][1] === 3;
    };

    const nextFunc: NextFunc<Move> = (d: Move): Move[] => {
        const hash = md5(input + d[1]).split('').slice(0, 4);

        const ret: Move[] = [];
        for (let i = 0; i < hash.length; i++) {
            let [[dx, dy], dir] = directions[i];
            let x = d[0][0] + dx;
            let y = d[0][1] + dy;

            if (x < 0 || y < 0) continue;
            if (x > 3 || y > 3) continue;
            
            if (['b', 'c', 'd', 'e', 'f'].includes(hash[i])) {
                // let split = d[1].split('_');
                ret.push([[x, y], d[1] + dir]);
                // if (split.length === 1) {
                //     split.push('', '');
                // }
                // split[1] = split[1] + dir;
                // ret.push([[x, y], split.join('_')]);
            }
        }
        return ret;
    }

    const ret = breadth([[[0, 0], '']], hashFunc, testFunc, nextFunc);
    if (ret.constructor.name === 'Set') {
        return 0;
    }
    return (<Move>ret)[1];
}

export function part2(input: string): number | string {
    const directions: [[number, number], string][] = [
        [[0, -1], 'U'],
        [[0, 1], 'D'],
        [[-1, 0], 'L'],
        [[1, 0], 'R']
    ];

    const hashFunc: HashFunc<Move> = (d: Move): string => {
        return `${d[0][0]},${d[0][1]}:${d[1]}`;
    };

    const testFunc: TestFunc<Move> = (d: Move): boolean => {
        return false;
    };

    const nextFunc: NextFunc<Move> = (d: Move): Move[] => {
        const ret: Move[] = [];

        if (d[0][0] === 3 && d[0][1] === 3) return ret;

        const hash = md5(input + d[1]).split('').slice(0, 4);

        for (let i = 0; i < hash.length; i++) {
            let [[dx, dy], dir] = directions[i];
            let x = d[0][0] + dx;
            let y = d[0][1] + dy;

            // if (x === 3 && y === 3) continue;

            if (x < 0 || y < 0) continue;
            if (x > 3 || y > 3) continue;
            
            if (['b', 'c', 'd', 'e', 'f'].includes(hash[i])) {
                ret.push([[x, y], d[1] + dir]);
            }
        }
        return ret;
    }

    const ret = breadth([[[0, 0], '']], hashFunc, testFunc, nextFunc);
    if (ret.constructor.name === 'Set') {
        let arr = [...<Set<string>>ret];
        arr.sort((a, b) => b.length - a.length);
        for (let i = 0; i < arr.length; i++) {
            const hash = arr[i];
            const [coords, path] = hash.split(':');
            if (coords === '3,3') {
                return path.length;
            }
        }
        // return arr[0].split(':')[1].length;
        // return arr[0].split(':')[1];
    }
    return 0;
}

type Move = [[number, number], string];

// const transform = transforms.lines;
const transform = (d: string): string => d;

const testData = {
    part1: ['ihgpwlah', 'kglvqrro', 'ulqzkmiv'],
    part2: ['ihgpwlah', 'kglvqrro', 'ulqzkmiv']
};

const testAnswers = {
    part1: ['DDRRRD', 'DDUDRLRRUDRD', 'DRURDRUDDLLDLUURRDULRLDUUDDDRR'],
    part2: [370, 492, 830]
};

export { transform, testData, testAnswers };