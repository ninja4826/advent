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

export function all<T>(pred: (value: T, index: number, array: T[]) => boolean, arr: T[]): boolean {
    let is = arr.filter(pred);
    return is.length === arr.length;
}

export function enumerate<T>(collection: T[], start: number = 0): Iterable<[number, T]> {
    const iter: Iterable<[number, T]> = {
        [Symbol.iterator]: function* () {
            var cnt = start;
            for (var i = 0; i < collection.length; i++) {
                yield [cnt, collection[i]];
                cnt++;
            }
        }
    };
    return iter;
}