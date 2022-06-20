import { transforms } from 'advent-of-code-client';
import { HashFunc, TestFunc, NextFunc, breadth } from '../util/path_find';

export function part1(input: string[]): number | string {
    let molMap: Map<string, string[]> = new Map();

    for (let inp of input) {
        if (inp === '') break;

        let split = inp.split(' => ');

        let arr: string[] = [];
        if (molMap.has(split[0])) {
            arr = <string[]>molMap.get(split[0]);
        }

        arr.push(split[1]);
        molMap.set(split[0], arr);
    }
    
    let molecule = input[input.length - 1];

    let newMols = getReplacements(molecule, molMap);

    return newMols.length;
}

export function part2(input: string[]): number | string {
    let molecule = input[input.length - 1];
    let upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    let split = molecule.split('');

    let elements = split.filter(s => upperCase.includes(s)).length;
    let rn = 0;
    let y = 0;

    for (let i = 0; i < split.length; i++) {
        const letter = split[i];
        if (!upperCase.includes(letter)) continue;
        if (letter === 'R' && split[i+1] === 'n') {
            rn++;
        }
        if (letter === 'Y') {
            y++;
        }
    }

    return elements - (rn * 2) - (y * 2) - 1;
}

// export function part2(input: string[]): number | string {
//     let molMap: Map<string, string[]> = new Map();

//     for (let inp of input) {
//         if (inp === '') break;

//         let split = inp.split(' => ');

//         molMap.set(split[1], [split[0]]);
//     }
//     // console.log(molMap);
//     const molecule = input[input.length - 1];

//     let hashFunc: HashFunc<Move> = (d: Move): string => d[0];
//     let testFunc: TestFunc<Move> = (d: Move): boolean => d[0] === 'e';
//     let nextFunc: NextFunc<Move> = (d: Move): Move[] => {
//         console.log(d[0].length, d[1]);
//         let reps = getReplacements(d[0], molMap)
//             .filter(r => {
//                 if (r.length > 1 && r.includes('e')) return false;
//                 if (r.length > d[0].length) return false;
//                 return true;
//             }).map(r => <Move>[r, d[1]+1]);
//         return reps;
//     }

//     let ret = breadth([[molecule, 0]], hashFunc, testFunc, nextFunc, false);

//     if (ret.constructor.name === 'Set') {
//         console.error('ugh');
//         return 0;
//     }
//     ret = <Move>ret;
//     // console.log(ret);
//     return ret[1];
// }

type Move = [string, number];

function getReplacements(molecule: string, molMap: Map<string, string[]>): string[] {
    let newMols: Set<string> = new Set();

    for (let [k, v] of molMap) {
        for (let v2 of v) {
            for (let i = 0; i <= molecule.length - k.length; i++) {
                if (k === molecule.slice(i, i + k.length)) {
                    newMols.add(molecule.slice(0, i) + v2 + molecule.slice(i + k.length));
                }
            }
        }
    }

    return [...newMols];
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`H => HO
H => OH
O => HH

HOH`],
    part2: [`e => H
e => O
H => HO
H => OH
O => HH

HOH`, `e => H
e => O
H => HO
H => OH
O => HH

HOHOHO`]
};

const testAnswers = {
    part1: [4],
    part2: [3, 6]
};

export { transform, testData, testAnswers };