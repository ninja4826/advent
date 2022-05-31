import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(input: string[]): number | string {
    let reg = /p=<(-?\d+,-?\d+,-?\d+)>, v=<(-?\d+,-?\d+,-?\d+)>, a=<(-?\d+,-?\d+,-?\d+)>/;

    // let particles: Particle[] = [];
    let smallestAccel = Number.MAX_SAFE_INTEGER;
    let closestParticle = -1;

    for (let i = 0; i < input.length; i++) {
        let match = matcher(input[i], reg);
        logger.log(match);
        let pArr = match[1].split(',').map(Number);
        let vArr = match[2].split(',').map(Number);
        let aArr = match[3].split(',').map(Number);

        let particle: Particle = {
            p: [pArr[0], pArr[1], pArr[2]],
            v: [vArr[0], vArr[1], vArr[2]],
            a: [aArr[0], aArr[1], aArr[2]]
        };

        let accel = magnitude(particle.a);

        if (accel < smallestAccel) {
            smallestAccel = accel;
            closestParticle = i;
        }
        // particles.push(particle);
    }
    return closestParticle;
}

export function part2(input: string[]): number | string {
    let reg = /p=<(-?\s?\d+,-?\s?\d+,-?\s?\d+)>, v=<(-?\s?\d+,-?\s?\d+,-?\s?\d+)>, a=<(-?\s?\d+,-?\s?\d+,-?\s?\d+)>/;
    let particles: Particle[] = [];

    for (let i = 0; i < input.length; i++) {
        let match = matcher(input[i], reg);
        logger.log(match);
        let pArr = match[1].split(',').map(Number);
        let vArr = match[2].split(',').map(Number);
        let aArr = match[3].split(',').map(Number);

        let particle: Particle = {
            p: [pArr[0], pArr[1], pArr[2]],
            v: [vArr[0], vArr[1], vArr[2]],
            a: [aArr[0], aArr[1], aArr[2]]
        };

        particles.push(particle);
    }

    // let collisions: any = {};
    // let collisions: { [key: number]: Set<[number, number]> } = {};
    let collisions: Map<number, Set<[number, number]>> = new Map();

    for (let i = 0; i < particles.length; i++) {
        let p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
            let p2 = particles[j];
            let time = findCollisions(p1, p2);
            if (time > 0) {
                // if (!(time in collisions)) {
                //     collisions[time] = new Set();
                // }
                // collisions[time].add([i, j]);
                let set: Set<[number, number]> = new Set();
                if (collisions.has(time)) {
                    set = <Set<[number, number]>>collisions.get(time);
                }
                set.add([i, j]);
                collisions.set(time, set);
            }
        }
    }

    let alive: Set<number> = new Set(particles.map((p, i) => i));

    let sortedKeys = [...collisions.keys()].sort((a, b) => a - b);

    for (let time of sortedKeys) {
        let nowColliding: Set<number> = new Set();

        let collides = [...<Set<[number, number]>>collisions.get(time)];

        for (let [p1, p2] of collides) {
            if (alive.has(p1) && alive.has(p2)) {
                nowColliding.add(p1);
                nowColliding.add(p2);
            }
        }

        let nowArr = [...nowColliding];
        for (let n of nowArr) {
            alive.delete(n);
        }
    }

    return alive.size;
}

function getDifferences(x: Particle, y: Particle): [TripleTuple, TripleTuple, TripleTuple] {
    const diff = (r_x: TripleTuple, r_y: TripleTuple): TripleTuple => [r_x[0] - r_y[0], r_x[1] - r_y[1], r_x[2] - r_y[2]];

    let p_diffs = diff(x.p, y.p);
    let v_diffs = diff(x.v, y.v);
    let a_diffs = diff(x.a, y.a);

    return [p_diffs, v_diffs, a_diffs];
}

function checkCollision(ppp: TripleTuple, vvv: TripleTuple, aaa: TripleTuple, t: number): boolean {
    for (let i = 0; i < ppp.length; i++) {
        let p = ppp[i];
        let v = vvv[i];
        let a = aaa[i];

        let res = ((0.5 * a * t * t) + ((v+0.5*a)*t) + p) == 0 ;
        if (!res) {
            return false;
        }
    }
    return true;   
}

function findCollisions(x: Particle, y: Particle): number {
    let [ppp, vvv, aaa] = getDifferences(x, y);
    let p = ppp[0];
    let v = vvv[0];
    let a = aaa[0];
    let b = (-1 * v) - 0.5 * a;
    let D = b * b - 2 * a * p;

    if (a == 0) {
        if (v != 0) {
            let t = (-1 * p) / v;
            if (checkCollision(ppp, vvv, aaa, t)) {
                return t;
            }
        }
    } else if (D == 0) {
        let t = b / a;
        if (checkCollision(ppp, vvv, aaa, t)) {
            return t;
        }
    } else {
        for (let t of [(b - Math.pow(D, 0.5)) / a, (b + Math.pow(D, 0.5)) / a]) {
            if (checkCollision(ppp, vvv, aaa, t)) {
                return t;
            }
        }
    }

    return 0;
}

interface Particle {
    p: TripleTuple;
    v: TripleTuple;
    a: TripleTuple;
}

type TripleTuple = [number, number, number];

function magnitude(accels: [number, number, number]): number {
    return accels.map(a => Math.pow(a, 2)).reduce((p, c) => p+c, 0);
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`p=<4,0,0>, v=<0,0,0>, a=<-2,0,0>
p=<3,0,0>, v=<2,0,0>, a=<-1,0,0>`],
    part2: [`p=<-6,0,0>, v=< 3,0,0>, a=< 0,0,0>
p=<-4,0,0>, v=< 2,0,0>, a=< 0,0,0>
p=<-2,0,0>, v=< 1,0,0>, a=< 0,0,0>
p=< 3,0,0>, v=<-1,0,0>, a=< 0,0,0>`]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };