import { transforms } from 'advent-of-code-client';
import { lookup } from 'dns';
import { logger, matcher, progBar } from '../util';
import { Computer } from './computer';

export function part1(_input: string[]): number | string {
    let input = _input.map(i => i.split(' '));
    let ip = Number((<string[]>input.shift())[1]);
    let instructs: [string, number, number, number][] = input.map(i => [i[0], Number(i[1]), Number(i[2]), Number(i[3])]);

    let init = instructs[7][1];
    console.log('init:', init);
    let perturb = instructs[11][2];

    let ret = loop(0, init, perturb);

    let comp = new Computer();
    comp.state[0] = ret;
    comp.state[0] = 3115806;
    let len = comp.execute([['#ip', ''+ip], ...input]);
    console.log(len);
    console.log(comp.state);
    return ret;
}

export function part2(input: any): number | string {
    return 0;
}

function loop(init: number, perturb: number, input = 0): number {
    let bytes: number;
    let hash: number;
    bytes = input | 65536;
    hash = init;

    while (bytes) {
        hash += bytes & 255;
        hash &= 16777215;
        hash *= perturb;
        hash &= 16777215;
        bytes >>= 8;
    }
    return hash;
}

const transform = transforms.lines;

const testData = {
    part1: [`#ip 1
seti 123 0 5
bani 5 456 5
eqri 5 72 5
addr 5 1 1
seti 0 0 1
seti 0 0 5
bori 5 65536 4
seti 13431073 0 5
bani 4 255 3
addr 5 3 5
bani 5 16777215 5
muli 5 65899 5
bani 5 16777215 5
gtir 256 4 3
addr 3 1 1
addr 1 1 1
seti 27 0 1
seti 0 0 3
addi 3 1 2
muli 2 256 2
gtrr 2 4 2
addr 2 1 1
addi 1 1 1
seti 25 0 1
addi 3 1 3
seti 17 0 1
setr 3 0 4
seti 7 0 1
eqrr 5 0 3
addr 3 1 1
seti 5 0 1`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };