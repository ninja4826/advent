import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../util';
import DraftLog from 'draftlog';

DraftLog(console).addLineListener(process.stdin);

export function part1(input: any): number | string {

    let grid: string[][] = [];
    let drafts: any[] = [];
    for (let i = 0; i < 10; i++) {
        grid.push('*'.repeat(10).split(''));
        drafts.push(console.draft(grid[i].toString()));
    }
    var hits = 0;
    var doExit = true;
    setInterval(function () {
        grid = grid.map(c1 => c1.map(c2 => c2 = String.fromCharCode(c2.charCodeAt(0) + 1)));
        for (let i = 0; i < drafts.length; i++) {
            drafts[i](grid[i].join(''));
        }
        hits++;

        if (hits >= 10) {
            doExit = false;
        }
    }, 100);
    while (doExit) {

    }
    return 0;
}

export function part2(input: any): number | string {
    return 0;
}

const transform = transforms.lines;

const testData = {
    part1: ``,
    part2: ``
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };