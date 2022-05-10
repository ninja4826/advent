import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(input: number): number | string {
    const grid = genPower(input);

    let [, maxCoords] = findMaxPower2(grid, 3);

    return maxCoords;
}

export function part2(input: number): number | string {
    let maxPower = 0;
    let maxCoords = '';
    
    const grid = genPower(input);

    const b1 = new (require('cli-progress')).SingleBar({
        format: 'Power Cell'+' Progress |'+require('ansi-colors').cyan('{bar}')+'| {percentage}% || {value}/{total} Chunks || ETA: {eta_formatted} || Duration: {duration_formatted} || Speed: {speed}/m',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
        fps: 5
    });
    b1.start(300, 0, { speed: "N/A" });
    // const b1 = progBar('Power Cell', 300);
    
    for (let i = 1; i <= 300; i++) {
        let lastTime = new Date().getTime();
        let [power, coords] = findMaxPower2(grid, i);
        
        if (power > maxPower) {
            maxPower = power;
            maxCoords = `${coords},${i}`;
        }
        let timeCalc = new Date().getTime() - lastTime;
        timeCalc = timeCalc / 1000;
        timeCalc = timeCalc / 60;
        timeCalc = 1 / timeCalc;
        b1.update(i, { speed: timeCalc.toFixed(2) });
    }
    b1.stop();
    return maxCoords;
}

function genPower(input: number): number[][] {
    const grid: number[][] = [];

    for (let y = 1; y <= 300; y++) {
        let row: number[] = [];
        for (let x = 1; x <= 300; x++) {
            let rack = x + 10;
            let num = rack * y;
            num = num + input;
            num = num * rack;
            num = Number(num.toString().split('').reverse()[2]);
            num = num - 5;
            row.push(num);
        }
        grid.push(row);
    }
    return grid;
}

function genPower2(input: number): number[][] {
    const grid: number[][] = ['0'.repeat(300).split('').map(c => Number(c))];

    for (let y = 1; y <= 300; y++) {
        let row: number[] = [0];
        for (let x = 1; x <= 300; x++) {
            let rack = x + 10;
            let num = rack * y;
            num = num + input;
            num = num * rack;
            num = Number(num.toString().split('').reverse()[2]);
            num = num - 5;
            row.push(num);
        }
        grid.push(row);
    }

    for (let row = 1; row <= 300; row++) {
        for (let col = 1; col <= 300; col++) {
            grid[row][col] = (
                grid[row][col] +
                grid[row - 1][col] +
                grid[row][col - 1] +
                grid[row - 1][col - 1]
            );
        }
    }

    return grid;
}

function findMaxPower(grid: number[][], size: number): [number, string] {
    let maxPower = 0;
    let maxCoords = '';

    for (let y = 0; y <= grid.length - size; y++) {
        for (let x = 0; x <= grid[y].length - size; x++) {
            let xSlice = grid.slice(y, y+size).map(c1 => c1.slice(x, x+size));
            let power = xSlice.flat().reduce((p, c) => p+c, 0);

            if (power > maxPower) {
                maxPower = power;
                maxCoords = `${x+1},${y+1}`;
            }
        }
    }

    return [maxPower, maxCoords];
}

function findMaxPower2(grid: number[][], size: number): [number, string] {
    let maxPower = 0;
    let maxCoords = '';

    for (let y = 0; y < grid.length - size; y++) {
        for (let x = 0; x < grid[y].length - size; x++) {
            let sum = 0;
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    sum += grid[i + y][j + x];
                }
            }
            if (sum > maxPower) {
                maxPower = sum;
                maxCoords = `${x+1},${y+1}`;
            }
        }
    }
    return [maxPower, maxCoords];
}

const transform = (d: string): number => Number(d);

const testData = {
    part1: `18`,
    part2: ``
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };