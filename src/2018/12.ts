import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(input: string[]): number | string {
    return runGenerations(input, 20);
}

export function part2(input: any): number | string {
    return runGenerations(input, 50000000000);
}

function runGenerations(input: string[], numGen: number): number {
    let starter = (<string>input.shift()).split(': ')[1].split('');

    let origMap: Map<number, string> = new Map();

    for (let i = 0; i < starter.length; i++) {
        origMap.set(i, starter[i]);
    }

    input.shift();

    let rules: Map<string, string> = new Map();

    for (let i of input) {
        let split = i.split(' => ');
        rules.set(split[0], split[1]);
    }

    let differences: number[] = [0, 0, 0, 0, 1];
    let prevPlants = 0;

    const b1 = progBar('Plants', numGen);

    for (let i = 0; i < numGen; i++) {

        let keys = [...origMap.keys()].sort((a, b) => a - b);
        let min = Math.min(...keys);
        let max = Math.max(...keys);
        for (let j = min - 3; j <= max + 4; j++) {
            if (!origMap.has(j)) {
                origMap.set(j, '.');
            }
        }

        let newMap = new Map(origMap);
        outer: for (let key of origMap.keys()) {
            let str = '';
            for (let j = -2; j < 3; j++) {
                if (!origMap.has(key+j)) {
                    // continue outer;
                    str += '.';
                }
                str += <string>origMap.get(key+j);
            }

            if (rules.has(str)) {
                newMap.set(key, <string>rules.get(str));
            } else {
                newMap.set(key, '.');
            }
        }
        origMap = new Map(newMap);
        let orig = [...origMap.entries()];
        for (let [k,v] of orig) {
            if (v === '.') {
                origMap.delete(k);
            }
        }
        let sum = 0;
        let sKeys = [...origMap.keys()].sort((a, b) => a - b);
        for (let k of sKeys) {
            sum += k;
        }

        let difference = sum - prevPlants;
        differences.shift();
        differences.push(difference);
    
        if (new Set(differences).size == 1) {
            let remaining = 5 * Math.pow(10, 10) - i;
            let totalPlants = sum + difference * remaining;
            b1.stop();
            return sum;
        }

        prevPlants = sum;

        b1.update(i);
    }

    let sum = 0;
    let skeys = [...origMap.keys()].sort((a, b) => a - b);
    for (let key of skeys) {
        sum += key;
    }

    b1.stop();

    return sum;
}

const transform = transforms.lines;

const testData = {
    part1: `initial state: #..#.#..##......###...###

...## => #
..#.. => #
.#... => #
.#.#. => #
.#.## => #
.##.. => #
.#### => #
#.#.# => #
#.### => #
##.#. => #
##.## => #
###.. => #
###.# => #
####. => #`,
    part2: ``
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };