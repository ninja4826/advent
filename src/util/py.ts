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

export function pySlice<T>(coll: T[], start: number = 0, end: number = -1, step: number = 1): T[] {
    if (end === -1) {
        end = coll.length;
    }
    let ret: T[] = [];
    for (let i = start; i < end; i += step) {
        ret.push(coll[i]);
    }

    return ret;
}

export function roll<T>(coll: T[], num: number = 1): T[] {
    coll = coll.slice(0);
    if (num > 0) {
        num = num % coll.length;
        let orig = coll.slice(coll.length - num);
        return orig.concat(coll.splice(0, coll.length - num));
        // coll.push(...coll.splice(0, coll.length - num));
    } else if (num < 0) {
        num = Math.abs(num);
        num = num % coll.length;
        let orig = coll.slice(num);
        return orig.concat(coll.splice(0, num));
        // coll.push(...coll.splice(0, num));
    }
    return coll;
}