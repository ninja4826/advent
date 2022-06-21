import { transforms } from 'advent-of-code-client';

export function part1(input: string[]): number | string {
    let registers: any = { a: 0, b: 0 };

    const getNum = (str: string): number => isNaN(Number(str)) ? registers[str] : parseInt(str);
    
    let i = 0;
    
    while (i < input.length) {
        const inp = input[i];
        let op = inp.slice(0, 3);
        let args = inp.slice(4).split(', ');

        switch (op) {
            case 'hlf':
                registers[args[0]] = Math.floor(registers[args[0]] / 2);
                break;
            case 'tpl':
                registers[args[0]] *= 3;
                break;
            case 'inc':
                registers[args[0]] += 1;
                break;
            case 'jmp':
                i += getNum(args[0]);
                continue;
            case 'jie':
                if (getNum(args[0]) % 2 === 0) {
                    i += getNum(args[1]);
                    continue;
                }
                break;
            case 'jio':
                if (getNum(args[0]) === 1) {
                    i += getNum(args[1]);
                    continue;
                }
                break;
        }
        i++;
    }

    return registers['b'];
}

export function part2(input: string[]): number | string {
    let registers: any = { a: 1, b: 0 };

    const getNum = (str: string): number => isNaN(Number(str)) ? registers[str] : parseInt(str);
    
    let i = 0;
    
    while (i < input.length) {
        const inp = input[i];
        let op = inp.slice(0, 3);
        let args = inp.slice(4).split(', ');

        switch (op) {
            case 'hlf':
                registers[args[0]] = Math.floor(registers[args[0]] / 2);
                break;
            case 'tpl':
                registers[args[0]] *= 3;
                break;
            case 'inc':
                registers[args[0]] += 1;
                break;
            case 'jmp':
                i += getNum(args[0]);
                continue;
            case 'jie':
                if (getNum(args[0]) % 2 === 0) {
                    i += getNum(args[1]);
                    continue;
                }
                break;
            case 'jio':
                if (getNum(args[0]) === 1) {
                    i += getNum(args[1]);
                    continue;
                }
                break;
        }
        i++;
    }

    return registers['b'];
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`inc b
jio b, +2
tpl b
inc b`],
    part2: [``]
};

const testAnswers = {
    part1: [2],
    part2: [0]
};

export { transform, testData, testAnswers };