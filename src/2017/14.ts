import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';
import { v4 as uuid } from 'uuid';
import { Knot } from './knot';

export function part1(input: string): number | string {
    const strs: string[] = [];

    for (let i = 0; i < 128; i++) {
        strs.push(`${input}-${i}`);
    }

    const bins = strs.map(s => new Knot(s).bin.split('').map(s => s == '1' ? '1' : '').join('').length);
    return bins.reduce((p, c) => p+c, 0);
}

export function part2(input: string): number | string {
    const strs: string[] = [];

    for (let i = 0; i < 128; i++) {
        strs.push(`${input}-${i}`);
    }

    const bins = strs.map(s => new Knot(s).bin.split(''));
    const coords: string[] = [];

    for (let i = 0; i < 128; i++) {
        for (let j = 0; j < 128; j++) {
            if (bins[i][j] === '1') {
                coords.push(`${i},${j}`);
            }
        }
    }
    let regions: string[][] = coords.map(c => [c]);
    let changed: boolean = false;
    for (let k = 0; k < regions.length; k++) {
next:   for (let l = 0; l < regions.length; l++) {
            let region = regions[l];
            for (let coord of region) {
                let [_i, _j] = coord.split(',').map(Number);
                let neighbors: string[] = [];
                
                if (_i > 0) neighbors.push(`${_i-1},${_j}`);
                if (_j > 0) neighbors.push(`${_i},${_j-1}`);
                if (_i < 127) neighbors.push(`${_i+1},${_j}`);
                if (_j < 127) neighbors.push(`${_i},${_j+1}`);

                for (let i = 0; i < regions.length; i++) {
                    if (i == l) continue;
                    if (neighbors.filter(n => regions[i].includes(n)).length > 0) {
                        regions[i].push(...regions[l]);
                        regions[l] = [];
                        changed = true;
                        continue next;
                    }
                }
            }
        }
        regions = regions.filter(r => r.length > 0);
        if (!changed) break;
        changed = false;
        console.log(regions.length);
    }
    return regions.length;
}

// const transform = transforms.lines;
const transform = (d: string): string => d;

const testData = {
    part1: [`flqrgnkx`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };