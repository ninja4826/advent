import { transforms } from 'advent-of-code-client';
// import { logger, matcher, progBar } from '../util';

export function part1(input: string[]): number | string {
    // let i = 192;
    // let res = assembunny(input, i);

    // console.log(res);
    let i = 0;
    // return 0;
    while (true) {
        let res = assembunny(input, i);
        if (res) {
            break;
        }
        i += 1;
    }
    return i;
}

export function part2(input: string[]): number | string {
    return 0;
}

function assembunny(instructions: string[], a: number): boolean {
    // let register: Map<string, number> = new Map(Object.entries({
    //     a,
    //     b: 0,
    //     c: 0,
    //     d: 0
    // }));
    let register: { [key: string]: number } = {
        a,
        b: 0,
        c: 0,
        d: 0
    };

    let line = 0;
    let transmitted = [1];

    const interpret = (v: string): number => isNaN(Number(v)) ? register[v] : +v;

out:while (line < instructions.length) {
        const [instr, x, ..._y] = instructions[line].split(' ');
        const y = _y.length > 0 ? _y[0] : '';

        switch (instr) {
            case 'out':
                let _x = interpret(x);
                if (![0, 1].includes(_x) || _x == transmitted[transmitted.length - 1]) {
                    return false;
                } else {
                    transmitted.push(_x);
                }
                if (transmitted.length > 10) {
                    return true;
                }
                break;
            case 'cpy':
                // register.set(y, interpret(x));
                register[y] = interpret(x);
                break;
            case 'inc':
                // register.set(x, <number>register.get(x) + 1);
                register[x] += 1;
                break;
            case 'dec':
                // register.set(x, <number>register.get(x) - 1);
                register[x] -= 1;
                break;
            case 'jnz':
                if (interpret(x) != 0) {
                    line += interpret(y);
                    continue out;
                }
        }
        line += 1;
    }
    return false;
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [``],
    part2: [``]
};

const testAnswers = {
    part1: [0],
    part2: [0]
};

export { transform, testData, testAnswers };