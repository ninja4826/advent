import { transforms } from 'advent-of-code-client';
import { logger } from '../util';

import { Computer } from '../util/intcode';

export function part1(input: any): number | string {
    let comp = new Computer(input);
    return findOxygen2(comp, false);
}

export function part2(input: any): number | string {
    let comp = new Computer(input);
    return findOxygen2(comp, true);
}

function findOxygen2(droid: Computer, p2: boolean): number {
    const map: any = {};
    const pathStack: any[] = [];

    const getKey = (x: number, y: number): string => `${x}.${y}`;

    const setTile = (x: number, y: number, tile: number): void => {
        map[getKey(x, y)] = tile;
    };

    const getTile = (x: number, y: number): number | undefined => map[getKey(x, y)];

    const isVisited = (x: number, y: number): boolean => getTile(x, y) !== undefined;

    const isPath = (x: number, y: number): boolean => getTile(x, y) == 1;

    const getNextDir = (x: number, y: number): number | boolean => {
        return !isVisited(x, y+1) ? 1:
            !isVisited(x, y-1) ? 2 :
            !isVisited(x-1, y) ? 3 :
            !isVisited(x+1, y) ? 4 : false;
    };

    const getNewCoordinates = (tx: number, ty: number, dir: number): [number, number] => {
        switch (dir) {
            case 1:
                ty++;
                break;
            case 2:
                ty--;
                break;
            case 3:
                tx--;
                break;
            case 4:
                tx++;
                break;
        }

        return [tx, ty];
    }

    const getReverseDir = (dir: number): number => {
        switch (dir) {
            case 1: return 2;
            case 2: return 1;
            case 3: return 4;
            case 4: return 3;
        }
        return 0;
    }

    const getAdjacentTiles = (x: number, y: number) => {
        return [
            [x+1, y],
            [x-1, y],
            [x, y+1],
            [x, y-1]
        ];
    };

    const getBfsDepth = (x: number, y: number): number => {
        let queue = [[x, y]];
        let depth = -1;

        while (queue.length != 0) {
            const temp: [number, number][] = [];

            queue.forEach(coord => {
                getAdjacentTiles(coord[0], coord[1])
                .filter(adjCoord => isPath(adjCoord[0], adjCoord[1]))
                .forEach(adjCoord => {
                    setTile(adjCoord[0], adjCoord[1], 2);
                    temp.push([adjCoord[0], adjCoord[1]]);
                });
            });

            queue = temp;
            depth++;
        }

        return depth;
    };

    pathStack

    let x = 0;
    let y = 0;

    let dir = 0;
    let backTrack = false;
    let tile = 0;
    let tx = 0;
    let ty = 0;

    setTile(x, y, 1);

    do {
        dir = getNextDir(x, y) || pathStack.pop();
        backTrack = !getNextDir(x, y);

        droid.input(dir);
        tile = droid.output();

        [tx, ty] = getNewCoordinates(x, y, dir);
        setTile(tx, ty, tile);

        if (tile == 0) continue;

        !backTrack && pathStack.push(getReverseDir(dir));
        [x, y] = [tx, ty];
    } while (tile != 2);

    if (p2) {
        return getBfsDepth(x, y);
    } else {
        return pathStack.length;
    }
}

const transform = (data: string): number[] => data.split(',').map(c => parseInt(c));

const testData = {
    part1: '',
    part2: ''
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };