import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar, zip } from '../util';

export function part1(input: string[]): number | string {

    let grid: string = '.#./..#/###';

    let ruleMap: Map<string, string> = new Map();

    for (let inp of input) {
        let rule = inp.split(' => ');
        ruleMap.set(rule[0], rule[1]);
    }

    const iter = 5;

    for (let i = 0; i < iter; i++) {
        let chunks = splitToChunks(grid);
        for (let j = 0; j < chunks.length; j++) {
            const row = chunks[j];
            for (let k = 0; k < row.length; k++) {
                const el = row[k];
                let trans = getTransforms(el);

                for (let tran of trans) {
                    if (ruleMap.has(tran)) {
                        let rule = <string>ruleMap.get(tran);
                        chunks[j][k] = rule;
                    }
                }
            }
        }

        // joinGrid(chunks);
        grid = joinGrid(chunks);
        // console.log('after step');
        // console.log(splitToStr(chunks).join('\n'));
        // console.log(chunks);
    }

    // console.log(grid.split('/').join('\n'));

    let count = 0;
    let split = grid.split('');

    for (let i = 0; i < split.length; i++) {
        if (split[i] == '#') {
            count++;
        }
    }

    return count;
}

export function part2(input: string[]): number | string {
    let grid: string = '.#./..#/###';

    let ruleMap: Map<string, string> = new Map();

    for (let inp of input) {
        let rule = inp.split(' => ');
        ruleMap.set(rule[0], rule[1]);
    }

    const iter = 18;

    for (let i = 0; i < iter; i++) {
        let chunks = splitToChunks(grid);
        for (let j = 0; j < chunks.length; j++) {
            const row = chunks[j];
            for (let k = 0; k < row.length; k++) {
                const el = row[k];
                let trans = getTransforms(el);

                for (let tran of trans) {
                    if (ruleMap.has(tran)) {
                        let rule = <string>ruleMap.get(tran);
                        chunks[j][k] = rule;
                    }
                }
            }
        }

        // joinGrid(chunks);
        grid = joinGrid(chunks);
        // console.log('after step');
        // console.log(splitToStr(chunks).join('\n'));
        // console.log(chunks);
    }

    // console.log(grid.split('/').join('\n'));

    let count = 0;
    let split = grid.split('');

    for (let i = 0; i < split.length; i++) {
        if (split[i] == '#') {
            count++;
        }
    }

    return count;
}

function splitToChunks(_grid: string): string[][] {
    let res: string[][] = [];

    let grid = _grid.split('/');
    let size = grid.length * grid[0].length;

    // let chunkSize = size % 3 == 0 ? 3 : 2;
    let chunkSize = size % 2 == 0 ? 2 : 3;

    if (size === 9) {
        return [[_grid]];
    }

    for (let i = 0; i < grid.length; i += chunkSize) {
        let slice = grid.slice(i, i + chunkSize).map(s => s.split(''));
        // console.log('slice', slice);
        let arr: string[] = [];

        for (let j = 0; j < grid[0].length; j += chunkSize) {
            arr.push(slice.map(s => s.slice(j, j + chunkSize).join('')).join('/'))
        }
        res.push(arr);
    }

    // console.log(size);
    // console.log(res);
    // console.log(splitToStr(res).join('\n'));
    // console.log('');
    return res;
}

function splitToStr(split: string[][]): string[] {
    let str: string[] = [];
    let chunkSize = split[0][0].split('/').length;
    let size = (split[0][0].split('/').length * split.length) + (split.length - 1);
    for (let i = 0; i < size; i++) {
        str.push('');
    }
    for (let i = 0; i < split.length; i++) {
        const row = split[i];
        for (let j = 0; j < row.length; j++) {
            const column = row[j];
            let colSplit = column.split('/');

            for (let k = 0; k < colSplit.length; k++) {
                const col = colSplit[k];
                str[k + (i * chunkSize) + i] += col;
                if ((j + 1) < row.length) {
                    str[k + (i * chunkSize) + i] += '|';
                }
            }
        }
        if ((i + 1) < split.length) {
            str[i + ((i + 1) * chunkSize)] = new Array(split.length).fill('-'.repeat(chunkSize)).join('+');
        }
    }

    return str;
}

function getTransforms(grid: string): string[] {
    let trans: string[] = [grid];

    for (let i = 0; i < 3; i++) {
        let subj = trans[0];

        let arr = subj.split('/').map(s => s.split(''));

        let rot: string[][] = [];

        for (let i = 0; i < arr.length; i++) {
            rot.push(arr.map(a => a[i]).reverse());
        }
        trans.unshift(rot.map(r => r.join('')).join('/'));
    }

    let len = trans.length;

    for (let i = 0; i < len; i++) {
        trans.push(trans[i].split('/').map(g => g.split('').reverse().join('')).join('/'));
    }

    return trans;
}

function joinGrid(chunks: string[][]): string {
    let strArr: string[] = [];
    for (let i = 0; i < chunks.length; i++) {
        const row = chunks[i].map(c => c.split('/'));
        strArr.push(zip(...row).map(r => r.join('')).join('/'));
    }
    // console.log('strArr', strArr);
    return strArr.join('/');
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`../.# => ##./#../...
.#./..#/### => #..#/..../..../#..#`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };