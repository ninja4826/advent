const fs = require('fs');
import { transforms } from 'advent-of-code-client';
import { logger, matcher } from '../util';

export function part1(input: string[]): number | string {
    let reg = /Step (?<tgt>\w) must be finished before step (?<req>\w) can begin./;

    const tgtMap: Map<string, string[]> = new Map();
    tgtMap[Symbol.iterator] = function* () {
        let sorted = [...tgtMap.entries()].sort((a, b) => a[0].localeCompare(b[0]));
        for(let [key, value] of sorted) yield [key, value];
    }

    const parts: string[] = [];

    for (let i = 0; i < input.length; i++) {
        let match = matcher(input[i], reg);
        const tgt = match.groups.tgt;
        const req = match.groups.req;

        if (!tgtMap.has(req)) {
            tgtMap.set(req, []);
        }
        tgtMap.set(req, (<string[]>tgtMap.get(req)).concat([ tgt ]));
    }
    // fs.writeFileSync('output.json', JSON.stringify(Object.fromEntries(tgtMap), null, 2));
    let origSize = tgtMap.size;
    parts.push(...Array.from(new Set(Array.from(tgtMap.values()).flat().filter(t => !Array.from(tgtMap.keys()).includes(t)))));
    parts.sort((a, b) => a.localeCompare(b));
    console.log(parts);
    // return 0;

    // while (tgtMap.size > 0) {
    //     let tempParts: string[] = [];
    //     let tgtArr = Array.from(tgtMap.keys()).sort((a, b) => a.localeCompare(b));
    //     for (let tgt of tgtArr) {
    //         let reqs = tgtMap.get(tgt);
    //         if (!reqs) continue;
    //         for (let i = 0; i < reqs.length; i++) {
    //             if (parts.includes(reqs[i])) {
    //                 reqs.splice(i, 1);
    //             }
    //         }
    //         if (reqs.length == 0) {
    //             tempParts.push(tgt);
    //             tgtMap.delete(tgt);
    //             break;
    //         }
    //     }
    //     // console.log(`${tgtMap.size}/${origSize}`);
    //     tempParts.sort((a, b) => a.localeCompare(b));
    //     parts.push(...tempParts);
    // }

    while (tgtMap.size > 0) {
        let tempParts: string[] = [];

        for (let part of parts) {
            let changed = false;
            for (let [tgt, reqs] of tgtMap) {
                if (reqs.includes(part)) {
                    reqs.splice(reqs.indexOf(part));
                }

                if (reqs.length == 0) {
                    tempParts.push(tgt);
                    tgtMap.delete(tgt);
                    changed = true;
                }
            }
            tempParts.sort((a, b) => a.localeCompare(b));
            parts.push(...tempParts);
            if (changed) break;
        }
    }
    return parts.join('');
}

export function part2(input: any): number | string {
    return 0;
}

const transform = transforms.lines;

const testData = {
    part1: `Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`,
    part2: ``
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };