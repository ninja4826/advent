import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(input: string[]): number | string {
    let holders: string[] = [];
    let held: string[][] = [];

    for (let inp of input) {
        let split = inp.split(' -> ');
        if (split.length == 1) continue;
        holders.push(split[0].split(' ')[0]);
        held.push(split[1].split(', '));
    }
    let bottom = '';
out:for (let h of holders) {
        for (let he of held) {
            if (he.includes(h)) {
                continue out;
            }
        }
        bottom = h;
        break;
    }
    return bottom;
}

export function part2(input: any): number | string {
    let map: Map<string, string> = new Map();

    const recursor = (str: string): Prog => {
        let strStr = <string>map.get(str);
        let topProg: IProg = {
            name: str,
            _weight: +strStr.split(' ')[1].slice(1, -1),
            weight: 0,
            held: []
        };
        // let held = strStr.split(' -> ')[1].split(', ');
        let split = strStr.split(' -> ');
        if (split.length === 2) {
            let held = split[1].split(', ');
            for (let h of held) {
                let recursed = recursor(h);
                topProg.held.push(recursed);
            }
        }
        let realProg = new Prog(topProg);
        return realProg
    };
    
    let holders: string[] = [];
    let held: string[][] = [];

    for (let inp of input) {
        let split = inp.split(' -> ');
        let spaceSplit = inp.split(' ');
        map.set(spaceSplit[0], spaceSplit.join(' '));
        if (split.length == 1) continue;
        holders.push(split[0].split(' ')[0]);
        held.push(split[1].split(', '));
    }
    let bottom = '';
out:for (let h of holders) {
        for (let he of held) {
            if (he.includes(h)) {
                continue out;
            }
        }
        bottom = h;
        break;
    }

    let botProg = recursor(bottom);

    return botProg.drill();
    // console.log(botProg.weight);
    // console.log(botProg.weight);

    // return 0;
}

interface IProg {
    name: string;
    _weight: number;
    weight: number;
    held: IProg[];
}

class Prog implements IProg {
    name: string;
    _weight: number;
    held: Prog[];

    constructor(data: IProg) {
        this.name = data.name;
        this._weight = data._weight;
        this.held = data.held.map(h => new Prog(h));
    }

    get weight(): number {
        let sum = this._weight;
        for (let h of this.held) {
            sum += h.weight;
        }
        return sum;
    }

    set weight(v: number) {
        return;
    }

    get isBalanced(): boolean {
        let weights = this.held.map(h => h.weight);
        let weightSet = new Set(weights);

        return weightSet.size < 2;
    }

    drill(): number {
        if (!this.isBalanced) {
            let unbalanced = this.held.filter(h => !h.isBalanced);
            if (unbalanced.length > 0) {
                return unbalanced[0].drill();
            } else {
                let weights = this.held.map(h => h.weight);
                let obj: any = {};
                for (let w of weights) {
                    if (!(w in obj)) {
                        obj[w] = 0;
                    }
                    obj[w] += 1;
                }

                let dupe = 0;
                let single = 0;
                let singleID = -1;

                // for (let w in obj) {
                for (let i = 0; i < this.held.length; i++) {
                    let w = this.held[i].weight;
                    if (obj[w] == 1) {
                        single = w;
                        singleID = i;
                    } else {
                        dupe = w;
                    }
                }
                let diff = dupe - single;
                return this.held[singleID]._weight + diff;
            }
        }
        return 0;
    }
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`pbga (66)
xhth (57)
ebii (61)
havc (66)
ktlj (57)
fwft (72) -> ktlj, cntj, xhth
qoyq (66)
padx (45) -> pbga, havc, qoyq
tknk (41) -> ugml, padx, fwft
jptl (61)
ugml (68) -> gyxo, ebii, jptl
gyxo (61)
cntj (57)`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };