import { transforms } from 'advent-of-code-client';
import { logger } from '../util';

export function part1(input: string[]): number | string {
    let counts: [string[], string[]] = [[], []];

    for (let i of input) {
        let charsMap: { [key: string]: number } = {};
        let charsArr: string[] = i.split('');

        charsArr.forEach(char => {
            if (!(char in charsMap)) {
                charsMap[char] = 0;
            }
            charsMap[char] += 1;
        });
        let found2 = false;
        let found3 = false;
        for (let char in charsMap) {
            if (!found2 && charsMap[char] == 2) {
                counts[0].push(i);
                found2 = true;
            }
            if (!found3 && charsMap[char] == 3) {
                counts[1].push(i);
                found3 = true;
            }
        }
    }

    return counts[0].length * counts[1].length;
}

export function part2(input: string[]): number | string {
    let differs: string[][] = [];

    for (let i of input) {
        let iArr = i.split('');
        let jArr: string[];
        for (let j of input) {
            jArr = j.split('');

            let differNum = 0;

            for (let k = 0; k < iArr.length; k++) {
                if (iArr[k] !== jArr[k]) {
                    differNum++;
                }
            }
            if (differNum === 1) {
                differs = [iArr, jArr];
            }
        }
    }
    let str: string = '';
    for (let i = 0; i < differs[0].length; i++) {
        if (differs[0][i] === differs[1][i]) {
            str += differs[0][i];
        }
    }
    return str;
}

const transform = transforms.lines;

const testData = {
    part1: ``,
    part2: `abcde
fghij
klmno
pqrst
fguij
axcye
wvxyz`
};

const testAnswers = {
    part1: 0,
    part2: 'fgij'
};

export { transform, testData, testAnswers };