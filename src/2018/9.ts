import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';

const cliProgress = require('cli-progress');
const colors = require('ansi-colors');

export function part1(input: string): number | string {
    let reg = /(?<players>\d+) players; last marble is worth (?<marbles>\d+) points/;
    let match = matcher(input, reg);
    let playerCount = +match.groups.players;
    let marbleCount = +match.groups.marbles;

    return calcWinner(playerCount, marbleCount);
}

export function part2(input: any): number | string {
    let reg = /(?<players>\d+) players; last marble is worth (?<marbles>\d+) points/;
    let match = matcher(input, reg);
    let playerCount = +match.groups.players;
    let marbleCount = +match.groups.marbles;

    return calcWinner(playerCount, marbleCount * 100);
}

function calcWinner(numPlayers: number, lastMarble: number): number {
    let current: any = { value: 0 };
    current.prev = current;
    current.next = current;

    const players: number[] = [];

    for (let i = 0; i < numPlayers; i++) {
        players[i] = 0;
    }

    let currentPlayer = numPlayers - 1;

    const b1 = progBar('Marble', lastMarble);

    for (let num = 1; num <= lastMarble; num++) {
        currentPlayer = (currentPlayer + 1) % numPlayers;
        if (num % 23 === 0) {
            players[currentPlayer] += num;

            let target = current;
            for (let i = 0; i < 7; i++) {
                target = target.prev;
            }

            players[currentPlayer] += target.value;
            target.next.prev = target.prev;
            target.prev.next = target.next;
            current = target.next;
        } else {
            let target = current.next;
            let newMarble: any = { value: num, prev: target, next: target.next };
            target.next.prev = newMarble;
            target.next = newMarble;
            current = newMarble;
        }
        if ((num / lastMarble) % 0.05 == 0) {
            b1.update(num);
        }
    }
    b1.stop();
    return Math.max(...players);
}

const transform = (data: string) => data;

const testData = {
    part1: `10 players; last marble is worth 1618 points`,
    part2: ``
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };