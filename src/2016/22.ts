import { transforms } from 'advent-of-code-client';
import { matcher, range } from '../util';

export function part1(input: string[]): number | string {
    input = input.slice(2);

    let reg = /node-x(\d+)-y(\d+).+T\s+(\d+)T\s+(\d+)T\s+\d+%/;

    const used: number[] = [];
    const avail: number[] = [];

    const grid: string[][] = [];

    for (let i of range(26)) {
        grid.push(new Array(38).fill('.'))
    }

    for (let line of input) {
        let sizes = matcher(line, reg);
        // console.log(sizes);
        let x = +sizes[1];
        let y = +sizes[2];
        let usd = +sizes[3];
        let avl = +sizes[4];

        used.push(usd);
        avail.push(avl);

        if (usd > 100) {
            grid[y][x] = '#';
        } else if (usd === 0) {
            grid[y][x] = '_';
        }
    }

    grid[0][grid[0].length - 1] = 'G';
    grid[0][0] = 'F';

    console.log("Let's examine top 10 disks regarding free space:");
    avail.sort((a, b) => b - a);
    console.log(avail.slice(0, 10));
    console.log("And let's see 10 disks with the least amount of data:");
    used.sort((a, b) => a - b);
    console.log(used.slice(0, 10));
    console.log("This means that only one disk can be used as a 'receiver'.");
    let viable = used.filter(u => u <= 94 && u > 0);
    console.log(`There are ${viable.length} viable pairs of nodes.`);
    console.log('....');

    return viable.length;
}

export function part2(input: string[]): number | string {
    input = input.slice(2);

    let reg = /node-x(\d+)-y(\d+).+T\s+(\d+)T\s+(\d+)T\s+\d+%/;

    const used: number[] = [];
    const avail: number[] = [];

    const grid: string[][] = [];

    for (let i of range(26)) {
        grid.push(new Array(38).fill('.'))
    }

    for (let line of input) {
        let sizes = matcher(line, reg);
        // console.log(sizes);
        let x = +sizes[1];
        let y = +sizes[2];
        let usd = +sizes[3];
        let avl = +sizes[4];

        used.push(usd);
        avail.push(avl);

        if (usd > 100) {
            grid[y][x] = '#';
        } else if (usd === 0) {
            grid[y][x] = '_';
        }
    }

    grid[0][grid[0].length - 1] = 'G';
    grid[0][0] = 'F';

    console.log('I should plot the map of this storage cluster!');
    for (let line of grid) {
        console.log(line.join(''));
    }
    console.log("Now I see it");

    const start: [number, number] = [grid.length - 3, grid[grid.length - 3].indexOf('_')];
    const wall: [number, number] = [grid.length - 14, grid[grid.length - 14].indexOf('#') - 1];
    const goal: [number, number] = [0, grid[0].length - 1];
    const finish: [number, number] = [0, 0];

    const getManhattan = (a: [number, number], b: [number, number]): number => {
        let [x1, y1] = a;
        let [x2, y2] = b;

        return Math.abs(x2 - x1) + Math.abs(y2 - y1);
    };

    let steps = getManhattan(start, wall);
    steps += getManhattan(wall, goal);
    steps += 5 * (goal[1] - 1);

    return steps;
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [``],
    part2: [``]
};

const testAnswers = {
    part1: [0],
    part2: [0]
};

export { transform, testData, testAnswers };