import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(input: string[]): number | string {
    for (let inp of input) {
        new Pipe(inp);
    }
    return Pipe.getConnected(0).length;
}

export function part2(input: string[]): number | string {
    const groups: number[][] = [];
    let notInGroups = [...Pipe.map.keys()].filter(v => !groups.flat(2).includes(v));
    const haveAllGroups = (): boolean => {
        notInGroups = [...Pipe.map.keys()].filter(v => !groups.flat(2).includes(v));
        return notInGroups.length == 0;
    }
    for (let inp of input) {
        new Pipe(inp);
    }
    while (!haveAllGroups()) {
        console.log(notInGroups.length);
        let keys = notInGroups.sort((a, b) => a - b);
        groups.push(Pipe.getConnected(keys[0]));
    }

    return groups.length;
}

class Pipe {
    static map: Map<number, Pipe> = new Map();

    static getConnected(id: number): number[] {
        let set: Set<number> = new Set((<Pipe>this.map.get(id)).connected);

        for (let i = 0; i < this.map.size; i++) {
            for (let s of set) {
                let pipe = <Pipe>this.map.get(s);
                pipe.connected.forEach((p) => set.add(p));
            }
        }

        return [...set];
    }

    id: number;
    connected: number[];

    constructor(data: string) {
        let cntr = data.split(' <-> ');
        this.id = +cntr[0];
        this.connected = cntr[1].split(', ').map(Number);
        Pipe.map.set(this.id, this);
    }
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`0 <-> 2
1 <-> 1
2 <-> 0, 3, 4
3 <-> 2, 4
4 <-> 2, 3, 6
5 <-> 6
6 <-> 4, 5`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };