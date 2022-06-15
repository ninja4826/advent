import { transforms } from 'advent-of-code-client';
import { logger, permutator, zip } from '../util';

export function part1(input: string[]): number | string {
    return getNewPassword(input);
}

export function part2(input: string[]): number | string {
    let pass = getNewPassword(input);
    return getNewPassword(pass.split(''));
}

function getNewPassword(input: string[]): string {

    let lowerCase = 'abcdefghijklmnopqrstuvwxyz'.split('');

    const quickTest = () => ['i', 'o', 'l'].some(l => input.includes(l));

    let gen = permutator(lowerCase, { start: input, repeat: true, maxLen: 8});

    while (quickTest()) {
        let next = gen.next();
        if (next.done) {
            return '0';
        }
        input = next.value;
    }

    lowerCase.splice(lowerCase.indexOf('i'), 1);
    lowerCase.splice(lowerCase.indexOf('o'), 1);
    lowerCase.splice(lowerCase.indexOf('l'), 1);

    gen = permutator(lowerCase, { start: input, repeat: true, maxLen: 8 })

    while (true) {
        let next = gen.next();
        if (next.done) {
            return '0';
        }
        let val = next.value;

        let found = false;

        for (let [a, b, c] of zip(val, val.slice(1), val.slice(2))) {
            if (a.charCodeAt(0) === b.charCodeAt(0) - 1 &&
            a.charCodeAt(0) === c.charCodeAt(0) - 2) {
                found = true;
                break;
            }
        }
        if (!found) continue;

        let count = 0;
        let letters: string[] = [];
        for (let [a, b] of zip(val, val.slice(1))) {
            // if (a === b && a !== c) count++;
            if (a === b && !letters.includes(a)) {
                letters.push(a);
                count++;
            }
        }
        if (count < 2) continue;

        return val.join('');
    }
}

// const transform = transforms.lines;
const transform = (d: string): string[] => d.split('');

const testData = {
    part1: [`abcdefgh`, 'ghijklmn'],
    part2: [``]
};

const testAnswers = {
    part1: ['abcdffaa', 'ghjaabcc'],
    part2: [0]
};

export { transform, testData, testAnswers };