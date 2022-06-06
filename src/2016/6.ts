import { transforms } from 'advent-of-code-client';
// import { logger, matcher, progBar, zip } from '../util';

export function part1(_input: string[]): number | string {
    const input = _input.map(i => i.split(''));
    let msgMap: Map<string, number>[] = [];

    for (let i = 0; i < input[0].length; i++) {
        msgMap[i] = new Map();
    }

    for (let inp of input) {
        for (let i = 0; i < inp.length; i++) {
            const letter = inp[i];
            // const map = <Map<string, number>>msgMap.get(i);
            const map = msgMap[i];
            if (!map.has(letter)) {
                map.set(letter, 0);
            }
            map.set(letter, <number>map.get(letter) + 1);
            msgMap[i] = map;
        }
    }
    
    let arr: string[] = [];

    for (let map of msgMap) {
inner:  for (let [letter, val] of map) {
            if (val == Math.max(...map.values())) {
                arr.push(letter);
                break inner;
            }
        }
    }

    return arr.join('');
}

export function part2(_input: string[]): number | string {
    const input = _input.map(i => i.split(''));
    let msgMap: Map<string, number>[] = [];

    for (let i = 0; i < input[0].length; i++) {
        msgMap[i] = new Map();
    }

    for (let inp of input) {
        for (let i = 0; i < inp.length; i++) {
            const letter = inp[i];
            // const map = <Map<string, number>>msgMap.get(i);
            const map = msgMap[i];
            if (!map.has(letter)) {
                map.set(letter, 0);
            }
            map.set(letter, <number>map.get(letter) + 1);
            msgMap[i] = map;
        }
    }
    
    let arr: string[] = [];

    for (let map of msgMap) {
inner:  for (let [letter, val] of map) {
            if (val == Math.min(...map.values())) {
                arr.push(letter);
                break inner;
            }
        }
    }

    return arr.join('');
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`eedadn
drvtee
eandsr
raavrd
atevrs
tsrnev
sdttsa
rasrtv
nssdts
ntnada
svetve
tesnvt
vntsnd
vrdear
dvrsen
enarar`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };