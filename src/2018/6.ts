import { transforms } from 'advent-of-code-client';
import { logger, matcher } from '../util';

export function part1(input: [number, number][]): number | string {
    let minX = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    for (let coord of input) {
        minX = Math.min(coord[0], minX);
        maxX = Math.max(coord[0], maxX);
        minY = Math.min(coord[1], minY);
        maxY = Math.max(coord[1], maxY);
    }

    let width = (maxX - minX) + 1;
    let height = (maxY - minY) + 1;

    let coords = input.map(c => {
        c[0] -= minX;
        c[1] -= minY;
        return c;
    });

    let blackList: Set<number> = new Set();
    let counts: Map<number, number> = new Map();
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let minDist = getMinDist([x, y], coords);
            if (minDist === null) continue;

            if (!counts.has(minDist)) {
                counts.set(minDist, 0);
            }
            counts.set(minDist, <number>counts.get(minDist) + 1);

            if (y == 0 || x == 0 || y == (height - 1) || x == (width - 1)) {
                blackList.add(minDist);
            }
        }
    }
    let max = 0;
    for (let i = 0; i < coords.length; i++) {
        if (blackList.has(i)) continue;

        max = Math.max(<number>counts.get(i), max);
    }
    console.log(counts);
    return max;
}

export function part2(input: [number, number][]): number | string {
    let minX = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    for (let coord of input) {
        minX = Math.min(coord[0], minX);
        maxX = Math.max(coord[0], maxX);
        minY = Math.min(coord[1], minY);
        maxY = Math.max(coord[1], maxY);
    }

    let width = (maxX - minX) + 1;
    let height = (maxY - minY) + 1;

    let coords = input.map(c => {
        c[0] -= minX;
        c[1] -= minY;
        return c;
    });

    let count = 0;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let dist = coords
                .map(c => manhattan([x, y], [c[0], c[1]]))
                .reduce((p, c) => p+c, 0);
            if (dist < 10000) {
                count++;
            }
        }
    }

    return count;
}

function manhattan(p1: [number, number], p2: [number, number]): number {
    return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}

function getMinDist(p1: [number, number], _coords: [number, number][]): number | null {
    const coords = _coords.slice(0);
    let min = Number.POSITIVE_INFINITY;
    let minIdx = 0;
    for (let i = 0; i < coords.length; i++) {
        let m = manhattan(p1, coords[i]);
        if (m < min) {
            minIdx = i;
            min = m;
        }
    }
    coords.splice(minIdx, 1);
    for (let i = 0; i < coords.length; i++) {
        if (manhattan(p1, coords[i]) == min) {
            return null;
        }
    }

    return minIdx;
}

const transform = (data: string): [number, number][] => data.split('\n').map(c => {
    let d = c.split(', ').map(Number);
    return [d[0], d[1]];
});

const testData = {
    part1: `1, 1
1, 6
8, 3
3, 4
5, 5
8, 9`,
    part2: `1, 1
1, 6
8, 3
3, 4
5, 5
8, 9`
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };