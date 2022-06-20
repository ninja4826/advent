import { transforms } from 'advent-of-code-client';
import { matcher, permutator, zip } from '../util';

export function part1(input: string[]): number | string {
    let reg = /(\w+) would (\w+) (\d+) happiness units by sitting next to (\w+)\./;

    let costMap: any = {};
    let names: string[] = [];
    for (let inp of input) {
        let match = matcher(inp, reg);
        let subj = match[1];
        let verb = match[2];
        let num = +match[3];
        let targ = match[4];

        if (verb == 'lose') {
            num *= -1;
        }

        if (!(subj in costMap)) {
            costMap[subj] = {};
        }
        costMap[subj][targ] = num;
    }

    names = Object.keys(costMap);

    let perms = [...permutator(names, { repeat: false })]
        .map(p => [...p, p[0]]);
    let costs: number[] = [];

    for (let perm of perms) {
        let cost = 0;

        for (let [subj, targ] of zip(perm, perm.slice(1))) {
            cost += costMap[subj][targ];
            cost += costMap[targ][subj];
        }
        costs.push(cost);
    }

    return Math.max(...costs);
}

export function part2(input: string[]): number | string {
    let reg = /(\w+) would (\w+) (\d+) happiness units by sitting next to (\w+)\./;

    let costMap: any = {};
    let names: string[] = [];
    for (let inp of input) {
        let match = matcher(inp, reg);
        let subj = match[1];
        let verb = match[2];
        let num = +match[3];
        let targ = match[4];

        if (verb == 'lose') {
            num *= -1;
        }

        if (!(subj in costMap)) {
            costMap[subj] = {};
        }
        costMap[subj][targ] = num;
    }

    names = Object.keys(costMap);
    
    costMap['Self'] = {};

    for (let n of names) {
        costMap['Self'][n] = 0;
        costMap[n]['Self'] = 0;
    }

    names.push('Self');

    let perms = [...permutator(names, { repeat: false })]
        .map(p => [...p, p[0]]);
    let costs: number[] = [];

    for (let perm of perms) {
        let cost = 0;

        for (let [subj, targ] of zip(perm, perm.slice(1))) {
            cost += costMap[subj][targ];
            cost += costMap[targ][subj];
        }
        costs.push(cost);
    }

    // console.log(perms.length);

    let max = 0;

    for (let cost of costs) {
        max = Math.max(cost, max);
    }

    return max;
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`Alice would gain 54 happiness units by sitting next to Bob.
Alice would lose 79 happiness units by sitting next to Carol.
Alice would lose 2 happiness units by sitting next to David.
Bob would gain 83 happiness units by sitting next to Alice.
Bob would lose 7 happiness units by sitting next to Carol.
Bob would lose 63 happiness units by sitting next to David.
Carol would lose 62 happiness units by sitting next to Alice.
Carol would gain 60 happiness units by sitting next to Bob.
Carol would gain 55 happiness units by sitting next to David.
David would gain 46 happiness units by sitting next to Alice.
David would lose 7 happiness units by sitting next to Bob.
David would gain 41 happiness units by sitting next to Carol.`],
    part2: [``]
};

const testAnswers = {
    part1: [330],
    part2: [0]
};

export { transform, testData, testAnswers };