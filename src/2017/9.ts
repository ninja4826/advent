import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

export function part1(_input: string): number | string {
    const input = _input.split('');
    let score = 0;
    let depth = 0;
    let inGarbage = false;
    for (let i = 0; i < input.length; i++) {
        let char = input[i];
        switch (char) {
            case '{':
                if (inGarbage) continue;
                depth += 1;
                break;
            case '}':
                if (inGarbage) continue;
                score += depth;
                depth -= 1;
                break;
            case '!':
                i++;
                break;
            case '<':
                if (inGarbage) continue;
                inGarbage = true;
                break;
            case '>':
                inGarbage = false;
                break;
            default:
                continue;
        }
    }
    return score;
}

export function part2(_input: string): number | string {
    const input = _input.split('');
    let score = 0;
    let depth = 0;
    let count = 0;
    let inGarbage = false;
    for (let i = 0; i < input.length; i++) {
        let char = input[i];
        if (char === '!') {
            i++;
            continue;
        }
        if (inGarbage && char !== '>') {
            count++;
        }
        switch (char) {
            case '{':
                if (inGarbage) continue;
                depth += 1;
                break;
            case '}':
                if (inGarbage) continue;
                score += depth;
                depth -= 1;
                break;
            case '!':
                i++;
                break;
            case '<':
                if (inGarbage) continue;
                inGarbage = true;
                break;
            case '>':
                inGarbage = false;
                break;
            default:
                continue;
        }
    }

    return count;
}

// const transform = transforms.lines;
const transform = (d: string): string => d;

const testData = {
    part1: ['{}', '{{{}}}', '{{},{}}', '{{{},{},{{}}}}', '{<a>,<a>,<a>,<a>}', '{{<ab>},{<ab>},{<ab>},{<ab>}}', '{{<!!>},{<!!>},{<!!>},{<!!>}}', '{{<a!>},{<a!>},{<a!>},{<ab>}}'],
    part2: ['<>', '<random characters>', '<<<<>', '<{!>}>', '<!!>', '<!!!>>', '<{o"i!a,<{i<a>']
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };