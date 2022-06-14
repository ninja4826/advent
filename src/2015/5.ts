import { transforms } from 'advent-of-code-client';
import { range, zip } from '../util';
import { logger } from '../util';

export function part1(input: string[]): number | string {
    let count = 0;
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    for (let inp of input) {
        if (['ab', 'cd', 'pq', 'xy']
            .map(s => inp.includes(s))
            .filter(p => p).length > 0) continue;

        let s = inp.split('');
        if (s.filter(s1 => vowels.includes(s1)).length < 3) continue;

        let found = false;
        for (let [s1, s2] of zip(s, s.slice(1))) {
            if (s1 === s2) {
                logger.log(inp);
                found = true;
                break;
            }
        }
        if (found) {
            count += 1;
        }
    }
    return count;
}

export function part2(input: string[]): number | string {
    let count = 0;

    for (let inp of input) {
        let found = false;
        let s = inp.split('');
        
        for (let i of range(s.length - 1)) {
            let s1 = s[i];
            let s2 = s[i+1];
            let str = s1 + s2;

            if (s.slice(i + 2).join('').includes(str)) {
                found = true;
                break;
            }
        }
        if (!found) continue;
        found = false;

        for (let [s1, s2, s3] of zip(s, s.slice(1), s.slice(2))) {
            if (s1 === s3) {
                found = true;
                break;
            }
        }
        if (!found) continue;
        console.log(inp);
        count += 1;
    }
    return count;
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`ugknbfddgicrmopn
aaa
jchzalrnumimnmhp
haegwjzuvuyypxyu
dvszwmarrgswjxmb`],
    part2: [`qjhvhtzxzqqjkmpb
xxyxx
uurcxstgmygtbstg
ieodomkazucvgmuy`]
};

const testAnswers = {
    part1: [2],
    part2: [2]
};

export { transform, testData, testAnswers };