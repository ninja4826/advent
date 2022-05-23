import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(input: number): number | string {
    let x = 0;
    let y = 0;
    let size = 3;
    let map: Map<number, string> = new Map();
    map.set(1, '0,0');

    for (let i = 2; i <= input; i++) {
        x++;
        map.set(i, `${x},${y}`);

        for (let j = 0; j < size - 2; j++) {
            i++;
            y++;
            map.set(i, `${x},${y}`);
        }
        for (let j = 0; j < size - 1; j++) {
            i++;
            x--;
            map.set(i, `${x},${y}`);
        }
        for (let j = 0; j < size - 1; j++) {
            i++;
            y--;
            map.set(i, `${x},${y}`);
        }
        for (let j = 0; j < size - 1; j++) {
            i++;
            x++;
            map.set(i, `${x},${y}`);
        }

        size += 2;
    }

    let coords = (<string>map.get(input)).split(',').map(Number);
    let dist = Math.abs(coords[0]) + Math.abs(coords[1])
    return dist;
}

export function part2(input: any): number | string {
    const getNeighbors = (map: Map<string, number>, x: number, y: number): number => {
        let sum = 0;

        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let dx = x + i;
                let dy = y + j;

                if (map.has(`${dx},${dy}`)) {
                    sum += <number>map.get(`${dx},${dy}`);
                }
            }
        }
        return sum;
    };
    let x = 0;
    let y = 0;
    let size = 3;
    let map: Map<string, number> = new Map();
    map.set('0,0', 1);

    const addMap = (): boolean => {
        let val = getNeighbors(map, x, y);
        map.set(`${x},${y}`, val);
        return val > input;
    }
    // let i = 2;
out:while (true) {
        x++;
        if (addMap()) break out;

        for (let j = 0; j < size - 2; j++) {
            y++;
            if (addMap()) break out;
        }
        for (let j = 0; j < size - 1; j++) {
            x--;
            if (addMap()) break out;
        }
        for (let j = 0; j < size - 1; j++) {
            y--;
            if (addMap()) break out;
        }
        for (let j = 0; j < size - 1; j++) {
            x++;
            if (addMap()) break out;
        }

        size += 2;
    }


    return <number>map.get(`${x},${y}`);
}

// const transform = transforms.lines;
const transform = (d: string): number => +d;
// const transform = (d: string): string => d;

const testData = {
    part1: ['1', '12', '23', '1024'],
    part2: [`750`]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };