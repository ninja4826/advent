export * from './logger';
export * from './intcode';

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

export function zip<T>(...arrays: T[][]): T[][] {
    return arrays[0].map(function(_, i) {
        return arrays.map(function(array){return array[i]});
    });
}

export function range(startStop: number | [number, number], step: number = 1): Iterable<number> {
    var start = 0;
    var stop = 0;
    if (Array.isArray(startStop)) {
        start = startStop[0];
        stop = startStop[1];
    } else {
        stop = startStop;
    }

    const iter: Iterable<number> = {
        [Symbol.iterator]: function* () {
            for (var i = start; i < stop; i += step) {
                yield i;
            }
        }
    };

    return iter;
}

export type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;