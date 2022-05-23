import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';
import { SortedList } from '../util/sorted_list';

export function part1(_input: string[]): number | string {
    const input = _input.map(i => i.split(' '));
    let count = 0;
out:for (let inp of input) {
        for (let i = 0; i < inp.length; i++) {
            for (let j = 0; j < inp.length; j++) {
                if (i === j) continue;
                if (inp[i] == inp[j]) continue out;
            }
        }
        count++;
    }
    return count;
}

export function part2(_input: string[]): number | string {
    const checkAnagram = (a: string, b: string): boolean => {
        if (a.length !== b.length) return false;
        let str1 = a.split('').sort().join('');
        let str2 = b.split('').sort().join('');
        return str1 === str2;
    };
    const input = _input.map(i => i.split(' '));
    let count = 0;

out:for (let inp of input) {
        for (let i = 0; i < inp.length; i++) {
            for (let j = 0; j < inp.length; j++) {
                if (i === j) continue;
                if (checkAnagram(inp[i], inp[j])) continue out;
            }
        }
        count++;
    }
    return count;
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`aa bb cc dd ee
aa bb cc dd aa
aa bb cc dd aaa`],
    part2: [`abcde fghij
abcde xyz ecdab
a ab abc abd abf abj
iiii oiii ooii oooi oooo
oiii ioii iioi iiio`]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };