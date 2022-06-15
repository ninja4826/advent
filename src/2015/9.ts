import { transforms } from 'advent-of-code-client';
import { matcher, permutator, zip } from '../util';
// import { logger, matcher, progBar } from '../util';

export function part1(input: string[]): number | string {
    const dists = getDistances(input);
    return Math.min(...dists);
}

export function part2(input: string[]): number | string {
    const dists = getDistances(input);
    return Math.max(...dists);
}

function getDistances(input: string[]): number[] {
    let reg = /(\w+) to (\w+) = (\d+)/;

    const costMap: any = {};

    let distMap: [string, string, number][] = [];
    
    for (let inp of input) {
        let match = matcher(inp, reg);
        
        const s1 = match[1];
        const s2 = match[2];
        const dist = +match[3];
        distMap.push([s1, s2, dist]);
        costMap[s1] = {};
        costMap[s2] = {};
    }

    // let cities = [...new Set(distMap.map(d => d[0]))];

    for (let [s1, s2, dist] of distMap) {
        costMap[s1][s2] = dist;
        costMap[s2][s1] = dist;
    }

    let cities = [...new Set(Object.keys(costMap))];

    let perms = permutator(cities);

    let zipped = perms.map(p => zip(p, p.slice(1)));

    let dists = zipped.map(z => z.map(z2 => costMap[z2[0]][z2[1]]).reduce((p, c) => p+c, 0));

    return dists;
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141`],
    part2: [``]
};

const testAnswers = {
    part1: [605],
    part2: [0]
};

export { transform, testData, testAnswers };