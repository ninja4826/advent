export * from './logger';
export * from './intcode';
export * from './py';
export * from './linked_list';
export * from './permutator';

export function matcher(str: string, _reg: RegExp | string): RealRegExpMatchArray {
    let reg: RegExp;
    if (typeof _reg === 'string') {
        reg = new RegExp(_reg);
    } else {
        reg = _reg;
    }
    let match = str.match(reg);
    if (match == null) {
        match = [];
        match.index = -1;
        match.input = str;
    }
    if (!('groups' in match)) {
        let groups: { [key: string]: string } = {};
        match.groups = groups;
    } 
    return <RealRegExpMatchArray>match;
}

export function chunk<T>(a: T[], n: number): Iterable<T[]> {
    const iter: Iterable<T[]> = {
        [Symbol.iterator]: function* () {
            for (var i = 0; i < a.length; i += n) {
                yield a.slice(i, i + n);
            }
        }
    };

    return iter;
}

export function factorial(n: number): number {
    let rVal = 1;
    for (let i = 2; i <= n; i++) {
        rVal = rVal * i;
    }
    return rVal;
}
export interface RealRegExpMatchArray extends RegExpMatchArray {
    groups: { [key: string]: string };
}

export function progBar(name: string, total: number): any {
    const b1 = new (require('cli-progress')).SingleBar({
        format: name+' Progress |'+require('ansi-colors').cyan('{bar}')+'| {percentage}% || {value}/{total} Chunks || ETA: {eta_formatted} || Duration: {duration_formatted}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
        fps: 5
    });

    b1.start(total, 0);

    return b1;
}

export type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;