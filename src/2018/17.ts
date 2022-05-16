import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(input: string[]): number | string {
    let coordinates = input.map(l => l.split(', ').map(e => e.split('=')).sort(a => a[0] == 'y' ? -1 : 1).map(e => e[1].split('..').map(Number)));
    let spring = [0, 500];

    let perimeter = [
        [coordinates[0][0][0], coordinates[0][1][0]],
        [coordinates[0][0][0], coordinates[0][1][0]]
    ];

    for (let c of coordinates) {
        for (let j = 0; j < 2; j++) {
            if (perimeter[0][j] > c[j][0]) {
                perimeter[0][j] = c[j][0];
            }
            if (perimeter[1][j] < c[j][c[j].length-1]) {
                perimeter[1][j] = c[j][c[j].length-1];
            }
        }
    }

    perimeter[0][1] -= 1;
    perimeter[1][1] += 1;
    let rightPerimeter = perimeter.map(p => p.slice());

    perimeter[0][0] = spring[0];

    let screen = initScreen(perimeter, coordinates, spring);
    flow(screen, spring, DIRECTION_VERTICAL);

    printScreen(screen, [perimeter[0], [perimeter[1][0], perimeter[0][1] + 80]]);

    return countWaterTiles(screen, rightPerimeter, new Set(['~', '|']));
}

export function part2(input: string[]): number | string {
    let coordinates = input.map(l => l.split(', ').map(e => e.split('=')).sort(a => a[0] == 'y' ? -1 : 1).map(e => e[1].split('..').map(Number)));
    let spring = [0, 500];

    let perimeter = [
        [coordinates[0][0][0], coordinates[0][1][0]],
        [coordinates[0][0][0], coordinates[0][1][0]]
    ];

    for (let c of coordinates) {
        for (let j = 0; j < 2; j++) {
            if (perimeter[0][j] > c[j][0]) {
                perimeter[0][j] = c[j][0];
            }
            if (perimeter[1][j] < c[j][c[j].length-1]) {
                perimeter[1][j] = c[j][c[j].length-1];
            }
        }
    }

    perimeter[0][1] -= 1;
    perimeter[1][1] += 1;
    let rightPerimeter = perimeter.map(p => p.slice());

    perimeter[0][0] = spring[0];

    let screen = initScreen(perimeter, coordinates, spring);
    flow(screen, spring, DIRECTION_VERTICAL);

    printScreen(screen, [perimeter[0], [perimeter[1][0], perimeter[0][1] + 80]]);

    return countWaterTiles(screen, rightPerimeter, new Set(['~']));
}


const DIRECTION_VERTICAL = [1, 0];
const DIRECTION_LEFT = [0, -1];
const DIRECTION_RIGHT = [0, 1];


function initScreen(perimeter: number[][], clays: number[][][], spring: number[]): string[][] {
    let screen: string[][] = [];
    for (let y = perimeter[0][0]; y <= perimeter[1][0]; y++) {
        screen[y] = [];
        for (let x = perimeter[0][1]; x <= perimeter[1][1]; x++) {
            screen[y][x] = '.';
        }
    }

    for (let clay of clays) {
        let minY = clay[0][0];
        let maxY = clay[0][clay[0].length-1];
        
        let minX = clay[1][0];
        let maxX = clay[1][clay[1].length-1];
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                screen[y][x] = '#';
            }
        }
    }

    screen[spring[0]][spring[1]] = '+';
    return screen;
}

function isPassable(symbol: string): boolean {
    return symbol === '.' || symbol === '|';
}

function flow(screen: string[][], point: number[], direction: number[], symbol: string = '|'): boolean {
    let position = point.slice();
    position[0] += direction[0];
    position[1] += direction[1];

    while (screen[position[0]] !== null && isPassable(screen[position[0]][position[1]])) {
        screen[position[0]][position[1]] = symbol;

        if (direction != DIRECTION_VERTICAL) {
            let sd = screen[position[0] + DIRECTION_VERTICAL[0]]
                [position[1] + DIRECTION_VERTICAL[1]];
            if (sd == '|') {
                return false;
            } else if (sd == '.') {
                return flow(screen, position, DIRECTION_VERTICAL);
            }
        }

        position[0] += direction[0];
        position[1] += direction[1];
    }

    if (screen[position[0]] == null || screen[position[0]][position[1]] == null) {
        return false;
    }

    if (direction == DIRECTION_VERTICAL) {
        let filledFloor;

        do {
            position[0] -= direction[0];
            position[1] -= direction[1];
            filledFloor = flow(screen, position, DIRECTION_LEFT);
            filledFloor = flow(screen, position, DIRECTION_RIGHT) && filledFloor;
            if (filledFloor) {
                flow(screen, position, DIRECTION_LEFT, '~');
                flow(screen, position, DIRECTION_RIGHT, '~');
                screen[position[0]][position[1]] = '~';
            }
        } while (filledFloor && position[0] != point[0]);

        return position[0] == point[0];
    }

    return true;
}

function countWaterTiles(screen: string[][], perimeter: number[][], waterSymbols: Set<string>): number {
    let tiles = 0;
    for (let y = perimeter[0][0]; y <= perimeter[1][0]; y++) {
        for (let x = perimeter[0][1]; x <= perimeter[1][1]; x++) {
            if (waterSymbols.has(screen[y][x])) {
                tiles++;
            }
        }
    }
    return tiles;
}

function printScreen(screen: string[][], perimeter: number[][]) {
    for (let y = perimeter[0][0]; y <= perimeter[1][0]; y++) {
        console.log(screen[y].slice(perimeter[0][1], perimeter[1][1]+1).join(''));
    }
}

const transform = transforms.lines;

const testData = {
    part1: ``,
    part2: ``
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };