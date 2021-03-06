export type FilterFunc<T> = (perm: T[], i: number) => boolean;

export interface PermOpts<T> {
    start?: T[];
    repeat?: boolean;
    maxLen?: number;
    filter?: FilterFunc<T>
}

export function* permutator<T>(arr: T[], opts: PermOpts<T>): Generator<T[], void, undefined> {
    const PermOptDefault: PermOpts<T> = {
        start: [],
        repeat: false,
        maxLen: 0
    };

    opts = {...PermOptDefault, ...opts };

    let size = 0;
    let data: T[] = [];
    let firstRun: boolean = false;
    if (opts.start && opts.start.length > 0) {
        size = opts.start.length;
        data = opts.start.slice();
        firstRun = true;
    } else {
        if (opts.maxLen) {
            size = opts.maxLen;
        } else {
            size = arr.length;
        }
    }

    if (opts.filter === undefined) {
        opts.filter = (): boolean => true;
    }

    let counter = 0;

    let startArr: number[] = data.map(d => arr.indexOf(d));

    let len = arr.length;
    if (size === len && !opts.repeat && (!opts.start || opts.start.length == 0)) {
        // console.log('running heaps...');
        return yield* heapsAlg(arr, <FilterFunc<T>>opts.filter);
    }

    let indicesUsed: boolean[] = [];

    const permutationUtil = function*(index: number): Generator<T[], void, undefined> {
        if (index === size) {
            if (firstRun) {
                firstRun = false;
                return;
            }
            if ((<FilterFunc<T>>opts.filter)(data.slice(), counter)) {
                counter++;
                return yield data.slice();
            } else {
                return;
            }
        }

        let start = 0;

        if (index < startArr.length) {
            start = startArr[index];
            startArr[index] = 0;
        }

        for (let i = start; i < len; i++) {
            if (opts.repeat || !indicesUsed[i]) {
                indicesUsed[i] = true;
                data[index] = arr[i];
                yield *permutationUtil(index + 1);
                indicesUsed[i] = false;
            }
        }
    };

    yield* permutationUtil(0);
}

function* heapsAlg<T>(arr: T[], filterCb: FilterFunc<T>): Generator<T[], void, undefined> {
    let size = arr.length;
    let counter = 0;
    const heapsUtil = function*(index: number): Generator<T[], void, undefined> {
        // if (index === size) return yield arr.slice();
        if (index === size) {
            if (filterCb(arr.slice(), counter)) {
                counter++;
                return yield arr.slice();
            } else {
                return;
            }
        }

        const swap = (_arr: T[], i: number, j: number): T[] => {
            let len = _arr.length;
            if (i >= len || j >= len) {
                console.warn("Swapping an array's elements past its length.");
            }
            let temp = _arr[j];
            _arr[j] = _arr[i];
            _arr[i] = temp;
            return _arr;
        };

        for (let j = index; j < size; j++) {
            swap(arr, index, j);
            yield* heapsUtil(index + 1);
            swap(arr, index, j);
        }
    }

    yield* heapsUtil(0);
}