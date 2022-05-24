import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

// export function part1(input: string[]): number | string {
//     for (let inp of input) {
//         new Scanner(inp);
//     }
//     Scanner.run();
//     return Scanner.catches.map(c => <Scanner>Scanner.map.get(c)).reduce((p, c) => p + (c.depth * c.range), 0);
// }

export function part1(input: string[]): number | string {
    let scanners: [number, number][] = [];

    for (let inp of input) {
        let split = inp.split(': ').map(Number);
        scanners.push([split[0], split[1]]);
    }

    return traverseFW(scanners).reduce((p, c) => p+c, 0);
}

function traverseFW(scanners: [number, number][], delay: number = 0): number[] {
    let arr: number[] = [];
    for (let [depth, range] of scanners) {
        if ((depth + delay) % (2 * (range - 1)) == 0) {
            arr.push(depth * range);
        }
    }

    return arr;
}

export function part2(input: string[]): number | string {
    let scanners: [number, number][] = [];

    for (let inp of input) {
        let split = inp.split(': ').map(Number);
        scanners.push([split[0], split[1]]);
    }
    let cnt = 0;
    while (true) {
        let caught = traverseFW(scanners, cnt);
        // for (let scnr of scanners) {
        //     caught = traverseFW(scnr, cnt);
        //     if (caught.length > 0) break;
        // }
        

        if (caught.length === 0) {
            break;
        }
        cnt++;
    }

    return cnt;
}

// export function part2(input: any): number | string {
//     for (let inp of input) {
//         new Scanner(inp);
//     }
//     let cnt = 3800000;
//     while (true) {
//     // for (let j = 0; j < 100; j++) {
//         Scanner.reset();
//         for (let inp of input) {
//             new Scanner(inp);
//         }
//         for (let i = 0; i < cnt; i++) {
//             Scanner.step();
//         }
//         Scanner.start = true;
//         Scanner.run();

//         if (Scanner.catches.length == 0) break;
//         // console.log(`${cnt}: ${Scanner.catches.length == 0}`);
//         // console.log(`${cnt}: ${Scanner.catches.includes(4)}`);
//         cnt++;
//         console.log(cnt);
//     }

//     return cnt;
// }

// export function part2(input: string[]): number | string {
//     for (let i = 0; i < input.length; i++) {
//         input[i] = `3: ${input[i]}`;
//     }
//     for (let inp of input) {
//         new Scanner(inp);
//     }

//     let cnt = 0;

//     while (true) {
//         Scanner.reset();
//         for (let inp of input) {
//             new Scanner(inp);
//         }

//         for (let i = 0; i < cnt; i++) {
//             Scanner.step();
//         }

//         Scanner.start = true;
//         Scanner.run();

//         if (Scanner.catches.length == 1 && cnt !== 0) {
//             console.log(`${[...Scanner.map.values()][0].range}: ${cnt}`);
//             break;
//         }
//         cnt++;

//     }
//     return 0;
// }

class Scanner {
    static map: Map<number, Scanner> = new Map();
    static pos: number = -1;
    static catches: number[] = [];
    static start: boolean = true;

    static step(): void {
        if (this.start) {
            this.pos += 1;
        }
        if (this.map.has(this.pos)) {
            let scn = <Scanner>this.map.get(this.pos);

            if (scn.pos == 0) {
                this.catches.push(this.pos);
            }
        }

        for (let [id, scn] of this.map) {
            scn.step();
            this.map.set(id, scn);
        }
    }

    static run(): void {
        let max = Math.max(...this.map.keys());

        while (this.pos <= max) {
            this.step();
        }
    }

    static reset(): void {
        this.map = new Map();
        this.pos = -1;
        this.catches = [];
        this.start = false;
    }

    depth: number;
    range: number;
    dir: number;
    pos: number;

    constructor(data: string) {
        let split = data.split(': ');
        this.depth = +split[0];
        this.range = +split[1];
        this.dir = 1;
        this.pos = 0;

        Scanner.map.set(this.depth, this);
    }

    step(): void {
        if (this.pos == 0) this.dir = 1;
        if (this.pos == this.range - 1) this.dir = -1;

        this.pos += (1 * this.dir);
    }
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`0: 3
1: 2
4: 4
6: 4`],
    part2: ['2', '3', '4', '5', '6']
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };