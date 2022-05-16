import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(input: [OpCrumb[], OpNum[]]): number | string {
    const [crumbs, ops] = input;
    console.log(crumbs.length);

    const caller = (func: OpFunc, a: number, b: number, c: number, _regs: OpNum): OpNum => {
        let regs = _regs.slice(0);
        return func(a, b, c, [regs[0], regs[1], regs[2], regs[3]]);
    };
    const verifier = (func: OpFunc, a: number, b: number, c: number, inp: OpNum, out: OpNum): boolean => {
        let ret = caller(func, a, b, c, inp);
        return ret[0] === out[0] &&
            ret[1] === out[1] &&
            ret[2] === out[2] &&
            ret[3] === out[3];
    };

    let totalCount = 0;
    for (let c of crumbs) {
        let cnt = 0;

        for (let f in FUNCS) {
            let func = FUNCS[f];
            if (verifier(func, c.opNums[1], c.opNums[2], c.opNums[3], c.before, c.after)) {
                cnt++;
            }
        }

        if (cnt >= 3) {
            totalCount++;
        }
    }

    return totalCount;
}

export function part2(input: [OpCrumb[], OpNum[]]): number | string {
    const [crumbs, ops] = input;

    const caller = (func: OpFunc, a: number, b: number, c: number, _regs: OpNum): OpNum => {
        let regs = _regs.slice(0);
        return func(a, b, c, [regs[0], regs[1], regs[2], regs[3]]);
    };
    const verifier = (func: OpFunc, a: number, b: number, c: number, inp: OpNum, out: OpNum): boolean => {
        let ret = caller(func, a, b, c, inp);
        return ret[0] === out[0] &&
            ret[1] === out[1] &&
            ret[2] === out[2] &&
            ret[3] === out[3];
    };

    let funcMap: Map<number, string[]> = new Map();

    for (let i = 0; i < 16; i++) {
        funcMap.set(i, Object.keys(FUNCS));
    }

    for (let c of crumbs) {
        let funcs = <string[]>funcMap.get(c.opNums[0]);
        let newList: string[] = [];
        for (let f of funcs) {
            let func = FUNCS[f];
            if (verifier(func, c.opNums[1], c.opNums[2], c.opNums[3], c.before, c.after)) {
                newList.push(f);
            }
        }
        funcMap.set(c.opNums[0], newList);
    }
    let newMap: Map<number, Set<string>> = new Map();
    for (let [k,v] of funcMap) {
        // logger.log(`op (${k}) : ${v}`);
        newMap.set(k, new Set(v));
    }

    for (let i = 0; i < 16; i++) {
        for (let [k1, v1] of newMap) {
            if (v1.size === 1) {
                for (let [k2, v2] of newMap) {
                    if (k1 === k2) continue;
                    v2.delete([...v1][0]);
                    newMap.set(k2, v2);
                }
            }
        }
    }

    let mappedFuncs: OpFunc[] = [];

    for (let i = 0; i < 16; i++) {
        let f = [...(<Set<string>>newMap.get(i))][0];
        let func = FUNCS[f];
        mappedFuncs.push(func);
    }

    let regs: OpNum = [0, 0, 0, 0];

    for (let o of ops) {
        let func = mappedFuncs[o[0]];
        regs = func(o[1], o[2], o[3], regs);
    }
    return regs[0];
}

type OpNum = [number, number, number, number];
type OpFunc = (a: number, b: number, c: number, regs: OpNum) => OpNum;

interface OpCrumb {
    before: OpNum;
    after: OpNum;
    opNums: OpNum;
}

const FUNCS: { [key:string]: OpFunc } = {
    addr: (a, b, c, regs) => {
        regs[c] = regs[a] + regs[b];
        return regs;
    },
    addi: (a, b, c, regs) => {
        regs[c] = regs[a] + b;
        return regs;
    },
    mulr: (a, b, c, regs) => {
        regs[c] = regs[a] * regs[b];
        return regs;
    },
    muli: (a, b, c, regs) => {
        regs[c] = regs[a] * b;
        return regs;
    },
    banr: (a, b, c, regs) => {
        regs[c] = regs[a] & regs[b];
        return regs;
    },
    bani: (a, b, c, regs) => {
        regs[c] = regs[a] & b;
        return regs;
    },
    borr: (a, b, c, regs) => {
        regs[c] = regs[a] | regs[b];
        return regs;
    },
    bori: (a, b, c, regs) => {
        regs[c] = regs[a] | b;
        return regs;
    },
    setr: (a, b, c, regs) => {
        regs[c] = regs[a];
        return regs;
    },
    seti: (a, b, c, regs) => {
        regs[c] = a;
        return regs;
    },
    gtir: (a, b, c, regs) => {
        regs[c] = (a > regs[b] ? 1 : 0);
        return regs;
    },
    gtri: (a, b, c, regs) => {
        regs[c] = (regs[a] > b ? 1 : 0);
        return regs;
    },
    gtrr: (a, b, c, regs) => {
        regs[c] = (regs[a] > regs[b] ? 1 : 0);
        return regs;
    },
    eqir: (a, b, c, regs) => {
        regs[c] = (a === regs[b] ? 1 : 0);
        return regs;
    },
    eqri: (a, b, c, regs) => {
        regs[c] = (regs[a] === b ? 1 : 0);
        return regs;
    },
    eqrr: (a, b, c, regs) => {
        regs[c] = (regs[a] === regs[b] ? 1 : 0);
        return regs;
    }
}

const transform = (data: string): [OpCrumb[], OpNum[]] => {
    let reg = /Before: \[(?<before>\d+, \d+, \d+, \d+)]\|(?<opNums>\d+ \d+ \d+ \d+)\|After:  \[(?<after>\d+, \d+, \d+, \d+)\]/;
    let [strings, ops] = data.split('\n\n\n\n');
    let opStrings = strings.split('\n\n').map(d => d.split('\n').join('|'));
    let crumbs: OpCrumb[] = [];
    for (let opStr of opStrings) {
        let match = matcher(opStr, reg);
        let before: number[] = match.groups.before.split(', ').map(Number);
        let after: number[] = match.groups.after.split(', ').map(Number);
        let opNums: number[] = match.groups.opNums.split(' ').map(Number);
        crumbs.push({
            before: [before[0], before[1], before[2], before[3]],
            after: [after[0], after[1], after[2], after[3]],
            opNums: [opNums[0], opNums[1], opNums[2], opNums[3]]
        });
    }
    let newOps: OpNum[] = [];
    if (ops) {
        newOps = ops
            .split('\n')
            .map(c1 => c1.split(' ').map(Number))
            .map(n => [n[0], n[1], n[2], n[3]]);
    }
    return [crumbs, newOps];
};

const testData = {
    part1: `Before: [3, 2, 1, 1]
9 2 1 2
After:  [3, 2, 2, 1]`,
    part2: ``
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };