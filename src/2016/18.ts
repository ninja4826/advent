import { transforms } from 'advent-of-code-client';
// import { logger, matcher, progBar } from '../util';

export function part1(input: string[][]): number | string {
    const iter = 40;

    for (let i = 1; i < iter; i++) {
        input = genRow(input);
    }
    console.log(input.map(i => i.join('')).join('\n'));
    return input.flat(2).filter(inp => inp === '.').length;
}

export function part2(input: string[][]): number | string {
    const iter = 400000;
    let count = input.flat(2).filter(inp => inp === '.').length;
    let curr = input[0];
    for (let i = 1; i < iter; i++) {
        curr = genRow2(curr);
        count += curr.filter(inp => inp === '.').length;
    }

    return count;
}

function genRow2(_last: string[]): string[] {
    const last = _last.slice(0);
    const newRow: string[] = [];

    for (let i = 0; i < last.length; i++) {
        let slice = last.slice(i - 1, i + 2);

        if (i < 1) {
            slice = ['.', ...last.slice(i, i + 2)];
        }
        if (i > last.length - 2) {
            slice = [...last.slice(i - 1, i + 1), '.'];
        }

        const sliceStr = slice.join('');

        if (sliceStr === '^^.' ||
            sliceStr === '.^^' ||
            sliceStr === '^..' ||
            sliceStr === '..^') {
                newRow.push('^');
        } else {
            newRow.push('.');
        }
    }

    return newRow;
}

function genRow(data: string[][]): string[][] {
    const last = data[data.length - 1].slice(0);

    const newRow: string[] = [];

    for (let i = 0; i < last.length; i++) {
        let slice = last.slice(i - 1, i + 2);

        if (i < 1) {
            slice = ['.', ...last.slice(i, i + 2)];
        }
        if (i > last.length - 2) {
            slice = [...last.slice(i - 1, i + 1), '.'];
        }

        const sliceStr = slice.join('');

        if (sliceStr === '^^.' ||
            sliceStr === '.^^' ||
            sliceStr === '^..' ||
            sliceStr === '..^') {
                newRow.push('^');
        } else {
            newRow.push('.');
        }
    }

    data.push(newRow);

    return data;
}

// const transform = transforms.lines;
const transform = (d: string): string[][] => [d.split('')];

const testData = {
    part1: [`.^^.^.^^^^`],
    part2: [``]
};

const testAnswers = {
    part1: [38],
    part2: [0]
};

export { transform, testData, testAnswers };