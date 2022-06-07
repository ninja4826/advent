import { transforms } from 'advent-of-code-client';
import { numbers } from 'advent-of-code-client/dist/util/transforms';
import { logger, matcher, progBar, zip, range, all, enumerate } from '../util';

export function part1(input: string[]): number | string {
    return calculateSteps('12', '00', 0, 0);
    return calculateSteps('00111', '00211', 0, 0);
}

export function part2(input: string[]): number | string {
    return 0;
}

function calculateSteps(gens: string, chips: string, lift: number, steps: number): number {
    let seen: Set<string> = new Set();

    let que: [string, string, number, number][] = [[gens, chips, lift, steps]];

    let k = 0;

    while (que.length > 0) {
        // console.log(que);
        // let state = <[string, string, number, number]>que.shift();
        let g: string;
        let c: string;
        [g, c, lift, steps] = <[string, string, number, number]>que.shift();
        
        let state: [string, string, number] = [g, c, lift];

        let hash_ = makeHash(...state);
        // console.log(state);
        if (k > 3) {
            // return 0;
        }
        k += 1;
        // console.log(hash_);
        if (seen.has(hash_) || isInvalid(...state)) continue;

        seen.add(hash_);

        let positions = (state[0] + state[1]).split('').map(Number);
        // console.log(positions);
        // let lift = state[2];

        if (isSolved(positions)) {
            return steps;
        }

        // console.log(positions, lift);
        
        for (let [i, first] of enumerate(positions)) {
            if (first == lift) {
                // console.log('i', i, first);
                if (lift < 3) {
                    positions[i] += 1;
                    que.push(getGCLs(positions, lift + 1, steps + 1));
                    positions[i] -= 1;
                }
                if (lift > 0) {
                    positions[i] -= 1;
                    que.push(getGCLs(positions, lift - 1, steps + 1));
                    positions[i] += 1;
                }

                for (let [j, second] of enumerate(positions.slice(i + 1), i + 1)) {
                    if (second == lift) {
                        if (lift < 3) {
                            positions[i] += 1;
                            positions[j] += 1;
                            que.push(getGCLs(positions, lift + 1, steps + 1));
                            positions[i] -= 1;
                            positions[j] -= 1;
                        }
                        if (lift > 0) {
                            positions[i] -= 1;
                            positions[j] -= 1;
                            que.push(getGCLs(positions, lift - 1, steps + 1));
                            positions[i] += 1;
                            positions[j] += 1;
                        }
                    }
                }
            }
        }
    }
    return 0;
}

function makeHash(gens: string, chips: string, lift: number, ...args: any[]): string {
    let g = [...range(4)].map(r => gens.split('').filter(g => r === +g).length);
    let c = [...range(4)].map(r => chips.split('').filter(c => r === +c).length);

    return g.concat(c).join('') + lift;
}

function isInvalid(gens: string, chips: string, lift: number, ...args: any[]): boolean {
    if (![...range(4)].includes(lift)) {
        return true;
    }

    for (let [gen, chip] of zip(gens.split(''), chips.split(''))) {
        if (chip !== gen && gen.split('').includes(chip)) return true;
    }
    return false;
}

function isSolved(positions: number[]): boolean {
    return all(v => v === 3, positions);
}

function getGCLs(positions: number[], l: number, s: number): [string, string, number, number] {
    let g = positions.slice(0, Math.floor(positions.length / 2)).join('');
    let c = positions.slice(Math.floor(positions.length / 2)).join('');
    if (c == '10' && l == 0 && s == 6) {
        // console.log(g, positions);
    }
    // console.log('gcls:', [g, c, l, s]);
    return [g, c, l, s];
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [``],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };