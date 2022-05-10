import { transforms } from 'advent-of-code-client';
import { logger, matcher } from '../util';

export function part1(input: any): number | string {
    const claims = getClaims(input);

    const counts: Map<string, number> = new Map();

    for (let v of claims.values()) {
        for (let str of v) {
            if (!counts.has(str)) {
                counts.set(str, 0);
            }
            counts.set(str, <number>counts.get(str) + 1);
        }
    }
    let count = 0;
    for (let v of counts.values()) {
        if (v > 1) {
            count++;
        }
    }
    return count;
}

export function part2(input: any): number | string {
    const claims = getClaims(input);

    const counts: Map<string, number> = new Map();

    for (let v of claims.values()) {
        for (let str of v) {
            if (!counts.has(str)) {
                counts.set(str, 0);
            }
            counts.set(str, <number>counts.get(str) + 1);
        }
    }

    for (let [k, claim] of claims) {
        let found = true;
        for (let c of claim) {
            if (<number>counts.get(c) > 1) {
                found = false;
                break;
            }
        }
        if (found) {
            return k;
        }
    }

    return 0;
}

function getClaims(input: string[]): Map<number, string[]> {
    let claims: Map<number, string[]> = new Map();
    let reg = /#(?<id>\d+) @ (?<left>\d+),(?<top>\d+): (?<width>\d+)x(?<height>\d+)/;
    for (let inp of input) {
        const match = matcher(inp, reg);

        const id = +match.groups.id;
        const left = +match.groups.left;
        const top = +match.groups.top;
        const width = +match.groups.width;
        const height = +match.groups.height;

        const right = left + width;
        const bottom = top + height;

        let claim: string[] = [];

        for (let i = left; i < right; i++) {
            for (let j = top; j < bottom; j++) {
                claim.push(`${i},${j}`);
            }
        }

        claims.set(id, claim);
    }
    return claims;
}

const transform = transforms.lines;

const testData = {
    part1: `#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2`,
    part2: `#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2`
};

const testAnswers = {
    part1: 4,
    part2: 3
};

export { transform, testData, testAnswers };