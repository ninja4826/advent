// import { transforms } from 'advent-of-code-client';
// import { logger, matcher, progBar, zip } from '../util';
import { SingleBar } from 'cli-progress';
import md5 from 'md5';

export function part1(input: string): number | string {
    let num = 0;

    let arr: string[] = [];

    while (true) {
        let hash = md5(input + num).split('');

        if (hash.slice(0, 5).join('') == '00000') {
            arr.push(hash[5]);
        }
        if (arr.length >= 8) {
            break;
        }
        num++;
    }

    return arr.join('');
}

export function part2(input: string): number | string {
    let num = -1;

    let arr: string[] = new Array(8).fill('_');
    let accepted = '01234567'.split('');
    const b1 = new SingleBar({
        format: 'Decrypt Progress |'+require('ansi-colors').cyan('{bar}')+'| {percentage}% || {value}/{total} Chunks || Duration: {duration_formatted} || Hash: {hash} || Password: {pwd}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
        fps: 5
    });
    b1.start(8, 0, { pwd: arr.join('') });
    while (true) {
        num++;
        b1.update(arr.filter(a => a != '_').length, {hash: input + num, pwd: arr.join('') });
        // console.log(num);
        let hash = md5(input + num).split('');
        if (hash.slice(0, 5).join('') == '00000') {
            // arr.push(hash[5]);
            if (!accepted.includes(hash[5])) continue;
            if (arr[+hash[5]] == '_') {
                arr[+hash[5]] = hash[6];
            }
            
        }
        if (arr.filter(a => a == '_').length == 0) {
            b1.update(arr.filter(a => a != '_').length, {hash: input + num, pwd: arr.join('') });
            b1.stop();
            return arr.join('');
        }
    }

    return arr.join('');
}

// const transform = transforms.lines;
const transform = (d: string): string => d;

const testData = {
    part1: [`abc`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };