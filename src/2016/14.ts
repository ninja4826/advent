import md5 from 'md5';
import { range, zip } from '../util';
import { SingleBar } from 'cli-progress';

export function part1(input: string): number | string {
    var i = 0;

    const found: [number, string][] = [];
    let triples: [number, string][] = [];
    const b1 = new SingleBar({
        format: 'One-Time Pad |'+require('ansi-colors').cyan('{bar}')+'| {percentage}% || {value}/{total} Chunks || ETA: {eta_formatted} || Duration: {duration_formatted} || At: {at}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
        fps: 5
    });

    b1.start(64, 0);

    while (true) {
        const hash = md5(input + i);
        const hashArr = hash.split('');
        let hashChar = '';

        triples = triples.filter(v => v[0] > (i - 1000));

        for (let [j, char] of triples) {
            if (hash.includes(char.repeat(5))) {
                found.push([j, hash]);
                b1.update(found.length, { at: j });
            }
        }

        for (let j = 0; j < hashArr.length - 2; j++) {
            if (hashArr[j] === hashArr[j+1] && hashArr[j] === hashArr[j+2]) {
                hashChar = hashArr[j];
                triples.push([i, hashChar]);
                break;
            }
        }

        if (found.length >= 64) {
            break;
        }
        i++;
    }
    b1.stop();
    return found[63][0];
}

export function part2(input: string): number | string {
    return findKeys(input);
}

function findKeys(salt: string): number {
    // let triplets: { [key: number]: string } = {};
    let triplets: Map<number, string> = new Map();
    let validKeys: Set<number> = new Set();
    let index = 0;
    const b1 = new SingleBar({
        format: 'One-Time Pad |'+require('ansi-colors').cyan('{bar}')+'| {percentage}% || {value}/{total} Chunks || ETA: {eta_formatted} || Duration: {duration_formatted} || At: {at}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
        fps: 5
    });

    b1.start(64, 0, { at: 0 });
    while (validKeys.size < 64 || index < Math.max(...validKeys) + 1000) {
        let hex = md5(salt + index);

        // console.log(hex);
        for (let _ of range(2016)) {
            hex = md5(hex.split('').join(''));
        }
        // console.log(hex);
        // return 0;
        let foundTriplet = false;
        let hexA = hex.split('');

        for (let [a, b, c] of zip(hexA, hexA.slice(1), hexA.slice(2))) {
            if (a === b && a === c) {
                if (hex.includes(a.repeat(5))) {
                // if (hex.includes(a.repeat(5))) {
                    for (let [k, v] of triplets) {
                        if (a == v && k < index && index <= 1000 + k) {
                            // console.log(validKeys.size, k);
                            validKeys.add(k);
                            b1.update(validKeys.size, { at: k });
                        }
                    }
                }
                if (!foundTriplet) {
                    triplets.set(index, a);
                    foundTriplet = true;
                }
            }
        }
        index += 1;
    }
    b1.stop();
    // return 0;
    let sorted = [...validKeys];
    sorted.sort((a, b) => a - b);
    // console.log(sorted);
    return sorted[63];
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