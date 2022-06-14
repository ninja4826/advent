import { transforms } from 'advent-of-code-client';
import { matcher, range } from '../util';
// import { logger, matcher, progBar } from '../util';

export function part1(input: string[]): number | string {

    let grid: boolean[][] = [];

    for (let i of range(1000)) {
        grid.push(new Array(1000).fill(false));
    }

    const turnOn = (g: boolean): boolean => true;
    const turnOff = (g: boolean): boolean => false;
    const toggle = (g: boolean): boolean => !g;

    let reg = /([\w\s]+) (\d+),(\d+) through (\d+),(\d+)/;

    for (let inp of input) {
        let match = matcher(inp, reg);

        let currFunc = toggle;

        if (match[1] == 'turn on') {
            currFunc = turnOn;
        }
        if (match[1] == 'turn off') {
            currFunc = turnOff;
        }

        let x1 = +match[2];
        let y1 = +match[3];
        let x2 = +match[4] + 1;
        let y2 = +match[5] + 1;
        for (let i of range([y1, y2])) {
            grid[i].splice(x1, x2 - x1, ...grid[i].slice(x1, x2).map(currFunc));
        }
    }
    return grid.flat(2).filter(p => p).length;
}

export function part2(input: string[]): number | string {

    let grid: number[][] = [];

    for (let i of range(1000)) {
        grid.push(new Array(1000).fill(0));
    }

    const turnOn = (g: number): number => g + 1;
    const turnOff = (g: number): number => g == 0 ? 0 : g - 1;
    const toggle = (g: number): number => g + 2;

    let reg = /([\w\s]+) (\d+),(\d+) through (\d+),(\d+)/;

    for (let inp of input) {
        let match = matcher(inp, reg);

        let currFunc = toggle;

        if (match[1] == 'turn on') {
            currFunc = turnOn;
        }
        if (match[1] == 'turn off') {
            currFunc = turnOff;
        }

        let x1 = +match[2];
        let y1 = +match[3];
        let x2 = +match[4] + 1;
        let y2 = +match[5] + 1;
        for (let i of range([y1, y2])) {
            grid[i].splice(x1, x2 - x1, ...grid[i].slice(x1, x2).map(currFunc));
        }
    }
    // return grid.flat(2).filter(p => p).length;
    return grid.flat(2).reduce((p, c) => p+c, 0);
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`turn on 0,0 through 999,999`, 'toggle 0,0 through 999,0', 'turn off 499,499 through 500,500'],
    part2: [`turn on 0,0 through 0,0`, 'toggle 0,0 through 999,999']
};

const testAnswers = {
    part1: [1000000, 1000, 0],
    part2: [1, 2000000]
};

export { transform, testData, testAnswers };