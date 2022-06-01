import { transforms } from 'advent-of-code-client';
import { logger } from '../util';
// import { logger, matcher, progBar, zip } from '../util';

export function part1(input: string[]): number | string {
    return findStrongest(input)[0];
}

export function part2(input: string[]): number | string {
    return findStrongest(input)[1][1];
}

function findStrongest(pipes: string[]): [number, [number, number]] {
    const connections: Map<number, Set<[number, number]>> = new Map();

    for (let p of pipes) {
        let set1: Set<[number, number]> = new Set();
        let set2: Set<[number, number]> = new Set();
        let [a, b] = p.split('/').map(Number);

        if (connections.has(a)) {
            set1 = <Set<[number, number]>>connections.get(a);
        }
        if (connections.has(b)) {
            set2 = <Set<[number, number]>>connections.get(b);
        }

        set1.add([a, b]);
        set2.add([a, b]);

        connections.set(a, set1);
        connections.set(b, set2);
    }

    let start: [[number, number][], number, number] = [[[0, 0]], 0, 0];

    let que: [[number, number][], number, number][] = [start];

    let maxScore = 0;
    let longestStrongest: [number, number] = [0, 0];

    while (que.length > 0) {
        let [path, score, conn] = <[[number, number][], number, number]>que.shift();
        if (score > maxScore) {
            maxScore = score;
        }
        if (path.length > longestStrongest[0] && score > longestStrongest[1]) {
            longestStrongest = [path.length, score];
        }

        for (let candidate of <Set<[number, number]>>connections.get(conn)) {
            if (!path.includes(candidate)) {
                let newConnection = candidate.filter((_, i) => i !== candidate.indexOf(conn))[0];
                let newScore = score + (candidate[0] + candidate[1]);
                let newPath = path.length > 0 ? path : [candidate];
                que.push([newPath, newScore, newConnection]);
            }
        }
        logger.log(que);
        if (que.length > 10) return [0, [0, 0]];
    }

    return [maxScore, longestStrongest];
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`0/2
2/2
2/3
3/4
3/5
0/1
10/1
9/10`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };