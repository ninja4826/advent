import { transforms } from 'advent-of-code-client';
import { logger } from '../util';

export function part1(input: any): number | string {
    let reg1 = /deal into new stack/;
    let reg2 = /cut (-?\d+)/;
    let reg3 = /deal with increment (=?\d+)/;

    let deck: number[] = new Array(10007).fill(0).map((c, i) => i);

    for (let i = 0; i < input.length; i++) {
        let inst = input[i];

        // deal new stack
        let match: MatcherRet = matcher(inst, reg1);
        if (match.matched) {
            deck.reverse();
            continue;
        }

        // cut
        match = matcher(inst, reg2);
        if (match.matched) {
            let cutNum = parseInt(match.match[1]);
            if (cutNum < 0) {
                cutNum = deck.length + cutNum;
            }

            let temp = deck.splice(0, cutNum);
            deck.push(...temp);
        }

        // deal with increment
        match = matcher(inst, reg3);
        if (match.matched) {
            let increment = parseInt(match.match[1]);
            let cursor = 0;
            let temp: number[] = new Array(deck.length);
            for (let j = 0; j < deck.length; j++) {
                temp[cursor] = deck[j];
                cursor += increment;

                if (cursor >= deck.length) {
                    cursor = cursor - deck.length;
                }
            }
            deck = temp.slice(0);
        }
    }

    // logger.log(deck.join(' '));
    return deck.indexOf(2019);
    // return 0;
}

export function part2(input: any): number | string {
    return finder(input, 119315717514047, 101741582076661, 2020);
}

function finder(data: string[], numCards: number, shuffles: number, find: number): number {
    let reg1 = /deal into new stack/;
    let reg2 = /cut (-?\d+)/;
    let reg3 = /deal with increment (=?\d+)/;

    let memory: [number, number] = [1, 0];

    data.reverse();

    for (let i = 0; i < data.length; i++) {
        let inst = data[i];

        // stack
        let match: MatcherRet = matcher(inst, reg1);
        if (match.matched) {
            memory[0] = memory[0] * -1;
            memory[1] = (memory[1] + 1) * -1;
        }

        // cut
        match = matcher(inst, reg2);
        if (match.matched) {
            let incr = parseInt(match.match[1]);
            memory[1] = memory[1] + incr;
        }

        // increment
        match = matcher(inst, reg3);
        if (match.matched) {
            let incr = parseInt(match.match[1]);

            let p = fastModPow(incr, numCards - 2, numCards);
            memory[0] = memory[0] * p;
            memory[1] = memory[1] * p;
        }

        memory[0] = memory[0] % numCards;
        memory[1] = memory[1] % numCards;
    }

    let power = fastModPow(memory[0], shuffles, numCards);

    return ((power * 2020) +
           ((memory[1] * (power + numCards)) *
           (fastModPow(memory[0], numCards - 2, numCards)))) % numCards;
}

// https://gist.github.com/krzkaczor/0bdba0ee9555659ae5fe
function fastModPow(a: number, b: number, n: number): number {
    a = a % n;
    let result = 1;
    let x = a;

    while (b > 0) {
        let leastSig = b % 2;
        b = Math.floor(b / 2);

        if (leastSig == 1) {
            result = result * x;
            result = result % n;
        }
        x = x * x;
        x = x % n;
    }
    return result;
}

type MatcherRet = {
    matched: true,
    match: RegExpMatchArray
} | {
    matched: false,
    match?: never
};

function matcher(str: string, reg: RegExp): MatcherRet {
    let match = str.match(reg);
    if (match) {
        return {
            matched: true,
            match: match
        }
    } else {
        return {
            matched: false
        };
    }
}

const transform = transforms.lines;

const testData = {
    part1: `deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1`,
    part2: `deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1`
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };