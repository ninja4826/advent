export * from './logger';
export * from './intcode';

export function matcher(str: string, reg: RegExp): RealRegExpMatchArray {
    let match = <RegExpMatchArray>str.match(reg);
    match.groups = match.groups || {};
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

export type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;