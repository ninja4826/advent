import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(input: any): number | string {
    return 0;
}

export function part2(input: any): number | string {
    return 0;
}

class Forest {
    map: string[][];
    height: number;
    width: number;

    constructor(mapString: string) {
        this.map = mapString.split('\n').map(l => l.split(''));
        this.height = this.map.length;
        this.width = this.map[0].length;
    }

    getSurrounding(oy: number, ox: number): { [key:string]: number } {
        let surrounding: { [key:string]: number } = {};
        for (let y = oy - 1; y <= oy + 1; y++) {
            for (let x = ox - 1; x <= ox + 1; x++) {
                if (y == oy && x == ox) continue;

                if (this.map[y] !== null) {
                    const symbol = this.map[y][x];
                    if (symbol !== null) {
                        surrounding[symbol] = (surrounding[symbol] || 0) + 1;
                    }
                }
            }
        }
        return surrounding;
    }

    spendMinute() {
        let newMap = new Array(this.height).fill(0).map(() => new Array(this.width));

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let acreContent = this.map[y][x];
                let surrounding = this.getSurrounding(y, x);

                switch (acreContent) {
                    case '.':
                        if (surrounding['|'] >= 3)
                            acreContent = '|';
                        break;
                    case '|':
                        if (surrounding['#'] >= 3)
                            acreContent = '#';
                        break;
                    case '#':
                        if (!(surrounding['#'] >= 1 && surrounding['|'] >= 1))
                            acreContent = '.';
                        break;
                }
                newMap[y][x] = acreContent;
            }
        }
        this.map = newMap;
    }

    toString(): string {
        return this.map.map(a => a.join('')).join('\n');
    }

    value(): number {
        let wooded = 0;
        let lumberyards = 0;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const s = this.map[y][x];
                if (s === '|') {
                    wooded++;
                } else if (s === '#') {
                    lumberyards++;
                }
            }
        }

        return wooded * lumberyards;
    }
}

const transform = transforms.lines;

const testData = {
    part1: ``,
    part2: ``
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };