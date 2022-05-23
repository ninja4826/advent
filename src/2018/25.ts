import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(input: string[]): number | string {
    return Star.getConstellations(input).length;
}

export function part2(input: any): number | string {
    return 0;
}

class Star {
    static getConstellations(data: string[]): Star[][] {
        let stars = data.map(d => new Star(d));
        let consts: Star[][] = [stars.splice(0, 1)];

star:   for (let i = 0; i < stars.length; i++) {
            let star = stars[i];
            for (let j = 0; j < consts.length; j++) {
                for (let s of consts[j]) {
                    if (star.isClose(s)) {
                        consts[j].push(star);
                        continue star;
                    }
                }
            }
            consts.push([star]);
        }

        for (let i = 0; i < consts.length; i++) {
            for (let j = 0; j < consts.length; j++) {
                for (let k = 0; k < consts.length; k++) {
                    if (j === k) continue;
                    if (Star.isConstClose(consts[j], consts[k])) {
                        consts[j].push(...consts[k]);
                        consts[k] = [];
                    }
                }
            }
        }
        return consts.filter(c => c.length > 0);
    }

    private static isConstClose(c1: Star[], c2: Star[]): boolean {
        for (let i = 0; i < c1.length; i++) {
            for (let j = 0; j < c2.length; j++) {
                if (c1[i].isClose(c2[j])) {
                    return true;
                }
            }
        }
        return false;
    }
    x: number;
    y: number;
    z: number;
    w: number;

    constructor(str: string) {
        let arr = str.split(',');
        this.x = +arr[0];
        this.y = +arr[1];
        this.z = +arr[2];
        this.w = +arr[3];
    }

    manhattan(s: Star): number {
        return Math.abs(this.x - s.x) +
            Math.abs(this.y - s.y) +
            Math.abs(this.z - s.z) +
            Math.abs(this.w - s.w);
    }

    isClose(s: Star): boolean {
        return this.manhattan(s) <= 3;
    }

    toString(): string {
        return `${this.x},${this.y},${this.z},${this.w}`;
    }
}

const transform = transforms.lines;

const testData = {
    part1: [`0,0,0,0
3,0,0,0
0,3,0,0
0,0,3,0
0,0,0,3
0,0,0,6
9,0,0,0
12,0,0,0`, `-1,2,2,0
0,0,2,-2
0,0,0,-2
-1,2,0,0
-2,-2,-2,2
3,0,2,-1
-1,3,2,2
-1,0,-1,0
0,2,1,-2
3,0,0,0`, `1,-1,0,1
2,0,-1,0
3,2,-1,0
0,0,3,1
0,0,-1,-1
2,3,-2,0
-2,2,0,0
2,-2,0,-1
1,-1,0,-1
3,2,0,2`, `1,-1,-1,-2
-2,-2,0,1
0,2,1,3
-2,3,-2,1
0,2,3,-2
-1,-1,1,-2
0,-2,-1,0
-2,2,3,-1
1,2,2,0
-1,-2,0,-2`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };