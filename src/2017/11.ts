import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(input: string[]): number | string {
    let [ count ] = pathing(input);
    return count;
}

export function part2(input: any): number | string {
    let [ , max ] = pathing(input);
    return max;
}

function pathing(input: string[]): [number, number] {
    const stepsBack = (x: number, y: number): number => {
        let dx = 0;
        let dy = 0;
        let count = 0;
        while (dx !== x || dy !== y) {
            let dir = '';
            if (dy > y) {
                dir += 's';
            } else {
                dir += 'n';
            }

            if (dx > x) {
                dir += 'w';
            } else if (dx < x) {
                dir += 'e';
            }

            switch (dir) {
                case 'n':
                    dy += 2;
                    break;
                case 'ne':
                    dy += 1;
                    dx += 1;
                    break;
                case 'se':
                    dy -= 1;
                    dx += 1;
                    break;
                case 's':
                    dy -= 2;
                    break;
                case 'sw':
                    dy -= 1;
                    dx -= 1;
                    break;
                case 'nw':
                    dy += 1;
                    dx -= 1;
                    break;
            }
            count++;
        }
        return count;
    };
    let x = 0;
    let y = 0;

    let max = 0;

    for (let inp of input) {
        switch (inp) {
            case 'n':
                y += 2;
                break;
            case 'ne':
                x += 1;
                y += 1;
                break;
            case 'se':
                x += 1;
                y -= 1;
                break;
            case 's':
                y -= 2;
                break;
            case 'sw':
                x -= 1;
                y -= 1;
                break;
            case 'nw':
                x -= 1;
                y += 1;
                break;
        }

        max = Math.max(max, stepsBack(x, y));
    }

    return [stepsBack(x, y), max];
}

const transform = (d: string): string[] => d.split(',');
// const transform = (d: string): string => d;

const testData = {
    part1: [`ne,ne,ne`, 'ne,ne,sw,sw', 'ne,ne,s,s', 'se,sw,se,sw,sw'],
    // part1: ['se,sw,se,sw,sw'],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };