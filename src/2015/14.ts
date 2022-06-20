import { transforms } from 'advent-of-code-client';
import { matcher, range } from '../util';

export function part1(input: string[]): number | string {
    const iter = 2503;
    let reg = /(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds\./;

    const reindeer: Reindeer[] = [];

    for (let inp of input) {
        let match = matcher(inp, reg);

        let rein: Reindeer = {
            name: match[1],
            speed: +match[2],
            runLen: +match[3],
            sleepLen: +match[4],
            dist: 0,
            points: 0
        };
        reindeer.push(rein);
    }

    for (let i of range(iter)) {
        for (let j = 0; j < reindeer.length; j++) {
            const rein = reindeer[j];
            if (i % (rein.runLen + rein.sleepLen) < rein.runLen) {
                reindeer[j].dist += rein.speed;
            }
        }
    }

    let dists = reindeer.map(r => r.dist);

    let max = 0;

    for (let dist of dists) {
        max = Math.max(dist, max);
    }

    return max;
}

export function part2(input: string[]): number | string {
    const iter = 2503;
    let reg = /(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds\./;

    const reindeer: Reindeer[] = [];

    for (let inp of input) {
        let match = matcher(inp, reg);

        let rein: Reindeer = {
            name: match[1],
            speed: +match[2],
            runLen: +match[3],
            sleepLen: +match[4],
            dist: 0,
            points: 0
        };
        reindeer.push(rein);
    }

    for (let i of range(iter)) {
        for (let j = 0; j < reindeer.length; j++) {
            const rein = reindeer[j];
            if (i % (rein.runLen + rein.sleepLen) < rein.runLen) {
                reindeer[j].dist += rein.speed;
            }
        }
        let dists = reindeer.map(r => r.dist);
        let maxDist = Math.max(...dists);

        for (let j = 0; j < reindeer.length; j++) {
            if (reindeer[j].dist == maxDist) {
                reindeer[j].points += 1;
            }
        }
    }

    let points = reindeer.map(r => r.points);

    let max = 0;

    for (let point of points) {
        max = Math.max(point, max);
    }

    return max;
}

interface Reindeer {
    name: string;
    speed: number;
    runLen: number;
    sleepLen: number;
    dist: number;
    points: number;
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.
Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.`],
    part2: [``]
};

const testAnswers = {
    part1: [1120],
    part2: [689]
};

export { transform, testData, testAnswers };