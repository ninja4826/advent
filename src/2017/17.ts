import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(input: number): number | string {
    // return spinlock(input, 2018, 2017, true);
    return spinlock2(input, 2018);
}

export function part2(input: number): number | string {
    // return spinlock(input, 50000000, 0, true);
    return spinlock2(input, 50000000);
}

function spinlock(num: number, iterations: number, findNum: number, doProg: boolean = false): number {
    let buf: CircularBuffer = new CircularBuffer(num, 0);
    logger.log(buf.toString());
    var b1: any = null;
    if (doProg) {
        b1 = progBar('Spinlock', iterations);
    }
    for (let i = 1; i < iterations; i++) {
        buf.push(i);
        if (buf.length < 11) {
            logger.log(buf.toString());
        }
        if (doProg && i % 100000 == 0) {
            b1.update(i);
        }
    }
    if (doProg) {
        b1.stop();
    }
    let idx = buf.indexOf(findNum);
    return buf.at(idx + 1);
}

function spinlock2(num: number, iter: number): number {
    let arr: number[] = [0];
    const b1 = progBar('Spinlock', iter);
    for (let i = 1; i < iter; i++) {
        for (let j = 0; j < num; j++) {
            // arr.unshift(<number>arr.pop());
            arr.push(<number>arr.shift());
        }
        arr.push(i);
        if (i < 11) logger.log(arr);
        b1.update(i);
    }
    b1.stop();
    return arr[0];
}

class CircularBuffer {

    arr: number[];
    offset: number = 1;
    pos: number = 0;

    constructor(offset: number = 1, ...init: number[]) {
        this.offset = offset;
        this.arr = [...init];
    }

    push(val: number): void {
        this.pos = ((this.pos + this.offset) % this.length) + 1;
        this.arr.splice(this.pos, 0, val);
    }

    indexOf(val: number): number {
        return this.arr.indexOf(val);
    }

    get length(): number {
        return this.arr.length;
    }

    at(idx: number): number {
        return this.arr[idx % this.length];
    }

    toString(): string {
        let vals = this.arr.map(a => ` ${a} `);
        vals[this.pos] = `(${this.arr[this.pos]})`;
        return vals.join('');
    }
}

// const transform = transforms.lines;
const transform = (d: string): number => +d;

const testData = {
    part1: [`3`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export class Settings {
    static testing: boolean = false;
}

export { transform, testData, testAnswers };