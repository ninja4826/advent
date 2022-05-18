import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';
import heapq, { Heap } from 'heap-js';

export function part1(input: string[]): number | string {
    let swarm = Swarm.fromLines(input);
    return swarm.signalRadiusCount();
}

export function part2(input: string[]): number | string {
    let swarm = Swarm.fromLines(input);
    return swarm.optimalLocationDistance();
}

type Pos = [number, number, number];
type Range = [number, number];
type Cube = [Range, Range, Range];

class Node {
    x: Range;
    y: Range;
    z: Range;
    size: number;

    constructor(c: Cube, size: number) {
        this.x = c[0];
        this.y = c[1];
        this.z = c[2];
        this.size = size;
    }

    get cube(): Cube {
        return [this.x, this.y, this.z];
    }

    get distance(): number {
        return Math.abs(Math.min(...this.x)) + Math.abs(Math.min(...this.y)) + Math.abs(Math.min(...this.z));
    }

    cost(swarm: Nanobot[]): number {
        let cube = this.cube;
        let count = 0;

        for (let s of swarm) {
            if (!s.intersects(cube)) {
                count++;
            }
        }
        return count;
    }

    priority(swarm: Nanobot[]): [number, number, number] {
        return [this.cost(swarm), this.distance, this.size];
    }

    *transitions(): IterableIterator<Node> {
        let size = this.size;
        if (!size) {
            return;
        }
        let pock = [0, size];
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                for (let k = 0; k < 2; k++) {
                    let cube: Cube = [
                        [this.x[0] + pock[i], this.x[1]],
                        [this.y[0] + pock[j], this.y[1]],
                        [this.z[0] + pock[k], this.z[1]]
                    ];
                    yield new Node(cube, size);
                }
            }
        }
    }
}

class Nanobot {
    x: number;
    y: number;
    z: number;
    r: number;

    constructor(c: Pos, r: number) {
        this.x = c[0];
        this.y = c[1];
        this.z = c[2];
        this.r = r;
    }

    get pos(): Pos {
        return [this.x, this.y, this.z];
    }

    distanceFrom(pos: Pos): number {
        return Math.abs(this.x - pos[0]) + Math.abs(this.y - pos[1]) + Math.abs(this.z - pos[2])
    }

    inRange(pos: Pos): boolean {
        return this.distanceFrom(pos) <= this.r;
    }

    intersects(cube: Cube): boolean {
        let dist = 0;
        let radius = this.r;

        for (let i = 0; i < 3; i++) {
            let c = this.pos[i];
            let [l, h] = cube[i];

            if (c < l) {
                dist += l - c;
            } else if (c > h) {
                dist += c - h;
            }
            if (dist > radius) {
                return false;
            }
        }

        return true;
    }
}

class Swarm {
    static fromLines(lines: string[]): Swarm {
        let reg = /pos=<(?<coord>-?\d+,-?\d+,-?\d+)>, r=(?<rad>\d+)/;
        let swarm: Nanobot[] = [];
        for (let line of lines) {
            let match = matcher(line, reg);
            let _c = match.groups.coord.split(',').map(Number);
            let c: Pos = [_c[0], _c[1], _c[2]];
            swarm.push(new Nanobot(c, +match.groups.rad));
        }
        return new Swarm(swarm);
    }

    swarm: Nanobot[];

    constructor(swarm: Nanobot[]) {
        this.swarm = swarm;
    }

    signalRadiusCount(): number {
        let temp = this.swarm.slice(0);
        temp.sort((a, b) => b.r - a.r);
        let maxSignal = temp[0];

        return this.swarm
            .filter(n => maxSignal.inRange(n.pos))
            .map(n => 1)
            .reduce((p, c) => p+c, 0);
    }

    optimalLocationDistance(): number {
        let swarm = this.swarm.slice(0);

        let minima: Pos = [
            Math.min(...this.swarm.map(s => s.x)),
            Math.min(...this.swarm.map(s => s.y)),
            Math.min(...this.swarm.map(s => s.z)),
        ];
        let maxima: Pos = [
            Math.max(...this.swarm.map(s => s.x)),
            Math.max(...this.swarm.map(s => s.y)),
            Math.max(...this.swarm.map(s => s.z))
        ];

        let cube: Cube = [
            [minima[0], maxima[0]],
            [minima[1], maxima[1]],
            [minima[2], maxima[2]]
        ];

        let step = 2 ** Math.round(Math.log2(Math.max(...maxima)) + 1);

        let start = new Node(cube, step);
        let unique = counter();
        let pqueue: Heap<[Pos, number, Node]> = new Heap((a, b) => {
            let first = b[0][0] - a[0][0];
            let second = b[0][1] - a[0][1];
            let third = b[0][2] - a[0][2];

            if (first !== 0) {
                return first;
            }
            if (second !== 0) {
                return second;
            }
            if (third !== 0) {
                return third;
            }
            return b[1] - a[1];
        });
        pqueue.init([[start.priority(swarm), unique.next().value, start]]);
        // let pqueue: [Pos, number, Node][] = [[start.priority(swarm), unique.next().value, start]];
        let outer = start;
        while (pqueue.length > 0) {
            outer = (<[Pos, number, Node]>pqueue.pop())[2];

            if (outer.size === 1) {
                break;
            }

            for (let n of outer.transitions()) {
                pqueue.push([n.priority(swarm), unique.next().value, n]);
            }
        }
        return outer.distance;
    }
}

class Coord {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    equals(c: Coord): boolean {
        if (this.y === c.y && this.x === c.x && this.z === c.z) {
            return true;
        }
        return false;
    }

    manhattan(c: Coord): number {
        return Math.abs(this.x - c.x) + Math.abs(this.y - c.y) + Math.abs(this.z - c.z);
    }

    toString(): string {
        return `${this.x},${this.y},${this.z}`;
    }
}

function* counter(): IterableIterator<number> {
    let i = 0;
    while (true) {
        yield i++;
    }
}

const transform = transforms.lines;

const testData = {
    part1: [`pos=<0,0,0>, r=4
pos=<1,0,0>, r=1
pos=<4,0,0>, r=3
pos=<0,2,0>, r=1
pos=<0,5,0>, r=3
pos=<0,0,3>, r=1
pos=<1,1,1>, r=1
pos=<1,1,2>, r=1
pos=<1,3,1>, r=1`],
    part2: [`pos=<10,12,12>, r=2
pos=<12,14,12>, r=2
pos=<16,12,12>, r=4
pos=<14,14,14>, r=6
pos=<50,50,50>, r=200
pos=<10,10,10>, r=5`]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };