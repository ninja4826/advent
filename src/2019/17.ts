import { transforms } from 'advent-of-code-client';
import { logger } from '../util';

import { Computer } from '../util/intcode';

export function part1(input: any): number | string {
    let str = '';

    let comp = new Computer(input);
    let currX = 0;
    let currY = 0;
    let grid: any = {};
    let view: string[][] = [];
    let currLine: string[] = [];
    while (true) {
        let out = comp.output();
        if (comp.done) break;
        let chr = String.fromCharCode(out);
        if (out == 10) {
            // logger.log(str);
            // str = '';
            currY++;
            currX = 0;
            view.push(currLine);
            currLine = [];
        } else {
            currX++;
            currLine.push(chr);
            // str += chr;
        }

        if (chr === '#' || chr === '^') {
            grid[`${currX},${currY}`] = chr;
        }
    }

    logger.log('\n', view.map(c => c.join('')).join('\n'));

    let neighs = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1]
    ];

    let intersects: [number, number][] = [];

    for (let y = 0; y < view.length; y++) {
        for (let x = 0; x < view[y].length; x++) {
            let intersect = true;
            if (view[y][x] === '#') {
                for (let n of neighs) {
                    if (y+n[1] >= view.length || y+n[1] < 0) continue;
                    if (x+n[0] >= view[y].length || x+n[0] < 0) continue;
                    if (view[y+n[1]][x+n[0]] !== '#') {
                        intersect = false;
                        // break;
                    }
                }
            } else {
                intersect = false;
                // break;
            }
            if (intersect) {
                intersects.push([x, y]);
            }
        }
    }

    // logger.log(str);
    // logger.log(intersects);
    return intersects.map(c => c[0]*c[1]).reduce((p, c) => p+c, 0);
}

export function part2(input: any): number | string {
    input[0] = 2;

    let _main = [
        ASCIICode.C,
        ASCIICode.A,
        ASCIICode.A,
        ASCIICode.B,
        ASCIICode.A,
        ASCIICode.B,
        ASCIICode.A,
        ASCIICode.B,
        ASCIICode.C,
        ASCIICode.C
    ];
    let _funcA = [
        ASCIICode.L,
        ord(9),
        ord(3),
        ASCIICode.R,
        ord(9),
        ord(1),
        ASCIICode.L,
        ord(4)
    ];
    let _funcB = [
        ASCIICode.L,
        ord(9),
        ord(3),
        ASCIICode.L,
        ord(6),
        ASCIICode.L,
        ord(4),
        ASCIICode.L,
        ord(4)
    ];
    let _funcC = [
        ASCIICode.L,
        ASCIICode.COMMA,
        ord(6),
        ASCIICode.COMMA,
        ASCIICode.R,
        ASCIICode.COMMA,
        ord(8),
        ASCIICode.COMMA,
        ASCIICode.L,
        ASCIICode.COMMA,
        ord(4),
        ASCIICode.COMMA,
        ASCIICode.R,
        ASCIICode.COMMA,
        ord(8),
        ASCIICode.COMMA,
        ASCIICode.L,
        ASCIICode.COMMA,
        ord(1),
        ord(2),
        ASCIICode.NEWLINE,
    ];

    let main: number[] = [];
    let funcA: number[] = [];
    let funcB: number[] = [];
    let funcC: number[] = _funcC.slice(0);

    for (let i = 0; i < _main.length; i++) {
        main.push(_main[i]);
        main.push(ASCIICode.COMMA);
    }

    for (let i = 0; i < _funcA.length; i++) {
        funcA.push(_funcA[i]);
        funcA.push(ASCIICode.COMMA);
    }

    for (let i = 0; i < _funcB.length; i++) {
        funcB.push(_funcB[i]);
        funcB.push(ASCIICode.COMMA);
    }

    // for (let i = 0; i < _funcC.length; i++) {
    //     funcC.push(_funcC[i]);
    //     funcC.push(ASCIICode.COMMA);
    // }

    main[main.length - 1] = ASCIICode.NEWLINE;
    funcA[funcA.length - 1] = ASCIICode.NEWLINE;
    funcB[funcB.length - 1] = ASCIICode.NEWLINE;
    // funcC[funcC.length - 1] = ASCIICode.NEWLINE;

    let inputs = [...main, ...funcA, ...funcB, ...funcC, ord('y'), ASCIICode.NEWLINE];
    // inputs = [65, 44, 66, 44, 67, 44, 66, 44, 65, 44, 67, 10];
    // inputs = main;
    // Computer.inputs = inputs;

    // let gen = Computer.runGen(...inputs);
    let comp = new Computer(input);
    comp.input(inputs);

    let currLine: string[] = [];

    let cnt = 0;
    let last = 0;

    while (true) {
        // let out = gen.next();
        let out = comp.output();
        if (comp.done) break;
        let chr = String.fromCharCode(out);
        if (out == 10) {
            // view.push(currLine);
            // logger.log(currLine.join(''));
            // if (cnt % 48 === 0 && cnt !== 0) logger.log('');
            cnt++;
            currLine = [];
        } else {
            currLine.push(chr);
            last = out;
        }
    };
    return last;
}

function ord(s: number | string): number {
    if (typeof s === 'number') {
        s = s.toString();
    }
    return (<string>s).charCodeAt(0);
}

enum ASCIICode {
    A = 65,
    B = 66,
    C = 67,
    COMMA = 44,
    NEWLINE = 10,
    L = 76,
    R = 82
};

const transform = (data: string): number[] => data.split(',').map(c => parseInt(c));

const testData = {
    part1: '',
    part2: ''
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };