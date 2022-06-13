import { logger } from './index';
const Deque = require('collections/deque');

export type IDeque = any;

export type HashFunc<T> = (d: T) => string;
export type TestFunc<T> = (d: T) => boolean;
export type NextFunc<T> = (d: T) => T[];

export function breadth<T>(start: T[], hashFunc: HashFunc<T>, testFunc: TestFunc<T>, nextFunc: NextFunc<T>): T | Set<string> {
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

        const next = nextFunc(data);
        for (let n of next) {
            que.push(n);
        }
    }

    return seen;
}