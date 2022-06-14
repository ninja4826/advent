import { transforms } from 'advent-of-code-client';
import { logger, permutator, range } from '../util';
import { breadth, HashFunc, TestFunc, NextFunc, ProgFunc } from '../util/path_find';
import { SingleBar } from 'cli-progress';

export function part1(input: string[]): number | string {

    logger.disable();

    Point.parseText(input);

    return Point.getSteps();
}

export function part2(input: string[]): number | string {

    logger.disable();

    Point.parseText(input);

    return Point.getSteps(true);
}

enum PointType {
    E, // Empty
    W, // Wall
    S  // Special
}

interface IPoint {
    x: number;
    y: number;
    val: string;
    type: PointType;
    neighbors: Point[];

    toString(): string;
}

class Point implements IPoint {
    static map: Map<string, Point> = new Map();
    private static _start: string;
    private static _goals: Map<string, string> = new Map();

    static parseText(_input: string[]): void {
        const input = _input.map(i => i.split(''));

        for (let i = 0; i < input.length; i++) {
            const inp = input[i];
            for (let j = 0; j < inp.length; j++) {
                const char = inp[j];
                const accessor = `${j},${i}`;
                const p = new Point(j, i, char);
                this.map.set(accessor, p);
                if (p.type === PointType.S) {
                    if (char === '0') {
                        this._start = accessor;
                    }
                    // this._goals.push(accessor);
                    // this._goalCoords.push(accessor);
                    // this._goals.push(char);
                    this._goals.set(char, accessor);
                }
            }
        }
    }

    static getSteps(doReturn: boolean = false): number {
        const hashFunc: HashFunc<Move> = (d: Move): string => {
            return `${d[0].toString()}:${d[1]}`;
        }

        const getTestFunc = (endCoord: string): TestFunc<Move> => {
            return (d: Move): boolean => d[0].toString() == endCoord;
        };

        const nextFunc: NextFunc<Move> = (d: Move): Move[] => {
            if (d[1] > 1e9) {
                return [];
            }

            const points = d[0].neighbors;

            return points.map(p => [p, d[1] + 1]);
        };

        const b1 = new SingleBar({
            format: 'Spelunking Progress |'+require('ansi-colors').cyan('{bar}')+'| {percentage}% || {value}/{total} Chunks || ETA: {eta_formatted} || Duration: {duration_formatted}',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true,
            fps: 5
        });

        let totalRuns = 0;

        for (let i of range(this._goals.size)) {
            totalRuns += i;
        }

        b1.start(totalRuns, 0);

        // const costMap: Map<string, Map<string, number>> = new Map();
        const costMap: any = {};

        for (let [g1, gc1] of this._goals) {
            // let currMap: Map<string, number> = new Map();
            let currMap: any = {};
            for (let [g2, gc2] of this._goals) {
                if (g1 === g2) continue;
                if (g2 in costMap && g1 in costMap[g2]) {
                    currMap[g2] = costMap[g2][g1];
                    continue;
                }

                let p1 = <Point>this.map.get(gc1);

                let ret = breadth([[p1, 0]], hashFunc, getTestFunc(gc2), nextFunc);

                if (ret.constructor.name === 'Set') {
                    return 0;
                }

                // console.log(`Found ${g1} -> ${g2}`);

                // currMap.set(g2, (<Move2>ret)[1]);
                currMap[g2] = (<Move>ret)[1];
                b1.increment();
            }
            // costMap.set(g1, currMap);
            costMap[g1] = currMap;
        }

        b1.stop();

        let lowest = Number.MAX_SAFE_INTEGER;

        let perms: string[][] = permutator([...this._goals.keys()]);

        perms = perms.filter(p => p[0] === '0');

        if (doReturn) {
            perms = perms.map(p => [...p, '0']);
        }

        for (let p of perms) {
            let cost = 0;
            
            for (let i = 0; i < p.length - 1; i++) {
                cost += costMap[p[i]][p[i+1]];
            }
            lowest = Math.min(lowest, cost);
        }

        return lowest;
    }


    x: number;
    y: number;
    val: string;
    private _type: PointType;

    constructor(x: number, y: number, val: string) {
        this.x = x;
        this.y = y;
        this.val = val;

        if (this.val === '#') {
            this._type = PointType.W;
        } else if (this.val === '.') {
            this._type = PointType.E;
        } else {
            this._type = PointType.S;
        }
    }

    get neighbors(): Point[] {
        let dirs: [number, number][] = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1]
        ];

        let ret: Point[] = [];

        for (let [dx, dy] of dirs) {
            const [vx, vy] = [dx + this.x, dy + this.y];
            const acc = `${vx},${vy}`;
            if (!Point.map.has(acc)) continue;
            let p = <Point>Point.map.get(acc);
            if (p.type !== PointType.W) {
                ret.push(p);
            }
        }
        return ret;
    }

    get type(): PointType {
        return this._type;
    }

    toString(): string {
        return `${this.x},${this.y}`;
    }
}

type Move = [Point, number];

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`###########
#0.1.....2#
#.#######.#
#4.......3#
###########`],
    part2: [``]
};

const testAnswers = {
    part1: [14],
    part2: [0]
};

export { transform, testData, testAnswers };