import { transforms } from 'advent-of-code-client';
import { count } from 'console';
import { logger, matcher, progBar } from '../util';

export function part1(input: string[][]): number | string {
    input[0].unshift(...' '.repeat(135).split(''));
    logger.log(input.map(i => i.join('')).join('\n'));
    logger.enable();
    const directions: any = {
        up: [0, -1],
        right: [1, 0],
        left: [-1, 0],
        down: [0, 1]
    };
    const opposites: any = {
        up: 'down',
        right: 'left',
        left: 'right',
        down: 'up'
    };
    const checkPlus = (x: number, y: number): string[] => {
        let posPaths: string[] = [];
        for (let dirName in directions) {
            let dir = directions[dirName];

            let dx = x + dir[0];
            let dy = y + dir[1];
            if (dy < 0 || dy >= input.length) continue;
            if (dx < 0 || dx >= input[0].length) continue;
            if (input[dy][dx] !== ' ') {
                posPaths.push(dirName);
            }
        }
        return posPaths;
    };

    let y = 0;
    let x = input[0].indexOf('|');
    let currDir = 'down';
    let letters: string[] = [];
    while (true) {
        let tile = input[y][x];
        logger.log(`(${x},${y}) - '${tile}'`);
        if (tile === ' ') {
            break;
        }
        if (tile === '+') {
            let posPaths = checkPlus(x, y);
            logger.log(posPaths);
            currDir = posPaths.filter(c => c !== opposites[currDir])[0];
        } else if (tile !== '|' && tile !== '-') {
            letters.push(tile);
        }
        x += directions[currDir][0];
        y += directions[currDir][1];
    }

    return letters.join('');
}

export function part2(input: string[][]): number | string {
    input[0].unshift(...' '.repeat(135).split(''));
    logger.log(input.map(i => i.join('')).join('\n'));
    logger.enable();
    const directions: any = {
        up: [0, -1],
        right: [1, 0],
        left: [-1, 0],
        down: [0, 1]
    };
    const opposites: any = {
        up: 'down',
        right: 'left',
        left: 'right',
        down: 'up'
    };
    const checkPlus = (x: number, y: number): string[] => {
        let posPaths: string[] = [];
        for (let dirName in directions) {
            let dir = directions[dirName];

            let dx = x + dir[0];
            let dy = y + dir[1];
            if (dy < 0 || dy >= input.length) continue;
            if (dx < 0 || dx >= input[0].length) continue;
            if (input[dy][dx] !== ' ') {
                posPaths.push(dirName);
            }
        }
        return posPaths;
    };

    let y = 0;
    let x = input[0].indexOf('|');
    let currDir = 'down';
    let letters: string[] = [];
    let count = 0;
    while (true) {
        let tile = input[y][x];
        logger.log(`(${x},${y}) - '${tile}'`);
        if (tile === ' ') {
            break;
        }
        if (tile === '+') {
            let posPaths = checkPlus(x, y);
            logger.log(posPaths);
            currDir = posPaths.filter(c => c !== opposites[currDir])[0];
        } else if (tile !== '|' && tile !== '-') {
            letters.push(tile);
        }
        x += directions[currDir][0];
        y += directions[currDir][1];
        count++;
    }

    return count;
}

const transform = (d: string): string[][] => d.split('\n').map(d2 => d2.split(''));
// const transform = (d: string): string => d;

const testData = {
    part1: [`     |          
     |  +--+    
     A  |  C    
 F---|----E|--+ 
     |  |  |  D 
     +B-+  +--+ `],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };