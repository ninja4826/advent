const Deque = require('collections/deque');

export type IDeque = any;

export function breadth<T>(start: T[], hashFunc: (d: T) => string, testFunc: (d: T) => boolean, nextFunc: (d: T, que: IDeque) => void): T | null {
    if (!Array.isArray(start)) {
        start = [start];
    }
    const que = new Deque(start);

    const seen: Set<string> = new Set();

    while (que.length > 0) {
        let data = que.shift();

        let hash = hashFunc(data);

        if (seen.has(hash)) continue;

        if (testFunc(data)) {
            return data;
        }

        seen.add(hash);

        nextFunc(data, que);
    }

    return null;
}