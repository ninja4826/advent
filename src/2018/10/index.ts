import * as fs from 'fs';
import { transforms } from 'advent-of-code-client';
import { logger, matcher, progBar } from '../../util';
import DraftLog from 'draftlog';
import path from 'path';

DraftLog(console).addLineListener(process.stdin);

export function part1(input: any): string | number {
    const reg = /position=<(?<x>[-\s\d]+),(?<y>[-\s\d]+)> velocity=<(?<vx>[-\s\d]+),(?<vy>[-\s\d]+)>/;

    let points: Point[] = [];

    for (let line of input) {
        let match = matcher(line, reg);
        points.push({
            x: Number(match.groups.x),
            y: Number(match.groups.y),
            vx: Number(match.groups.vx),
            vy: Number(match.groups.vy)
        });
    }

    let lastArea = Infinity;

    let minX = Math.min(...points.map(c => c.x));
    let maxX = Math.max(...points.map(c => c.x));
    let minY = Math.min(...points.map(c => c.y));
    let maxY = Math.max(...points.map(c => c.y));

    let currentArea = (maxX - minX) * (maxY - minY);

    while (currentArea < lastArea) {
        lastArea = currentArea;

        for (let p of points) {
            p.x += p.vx;
            p.y += p.vy;
        }

        minX = Math.min(...points.map(c => c.x));
        maxX = Math.max(...points.map(c => c.x));
        minY = Math.min(...points.map(c => c.y));
        maxY = Math.max(...points.map(c => c.y));

        currentArea = (maxX - minX) * (maxY - minY);
    }

    for (let i = 0; i < 1; i++) {
        for (let p of points) {
            p.x -= p.vx;
            p.y -= p.vy;
        }
    }

    minX = Math.min(...points.map(c => c.x));
    maxX = Math.max(...points.map(c => c.x));
    minY = Math.min(...points.map(c => c.y));
    maxY = Math.max(...points.map(c => c.y));

    let grid: boolean[][] = [];
    for (let x = 0; x <= maxX - minX; x++) {
        grid.push([]);
    }

    for (let point of points) {
        grid[point.x - minX][point.y - minY] = true;
    }

    let letterMaps: boolean[][][] = [];

    for (let i = 0; i < maxX - minX; i += 8) {
        let letterMap: boolean[][] = [];

        for (let y = 0; y <= maxY - minY; y++) {
            letterMap.push([]);
            for (let x = 0; x < 6; x++) {
                letterMap[y].push(!!grid[x + i][y]);
            }
        }

        letterMaps.push(letterMap);
    }

    let file = fs.readFileSync(path.resolve(__dirname, 'letters.txt'), 'utf-8');
    let letterLines = file.trim().replace(/\r\n/g, '\n').split('\n');

    let letterData: any = {};

    while (letterLines.length) {
        let char = <string>letterLines.shift();
        let d = [];
        for (let y = 0; y < 10; y++) {
            let line = letterLines.shift();
            d.push([].map.call(line, (c) => c === '#'));
        }
        letterData[char] = d;
    }

    let result = '';

    letterLoop: for (let letter of letterMaps) {
        charLoop: for (let char in letterData) {
            for (let x = 0; x < letterData[char].length; x++) {
                for (let y = 0; y < letterData[char][x].length; y++) {
                    if (letter[x][y] !== letterData[char][x][y]) {
                        continue charLoop;
                    }
                }
            }
            result += char;
            continue letterLoop;
        }

        logger.log('unrecognized letter data');
        logger.log(letter);
    }

    logger.log(result);

    return 0;
}

export async function part2(input: any): Promise<number | string> {
    const reg = /position=<(?<x>[-\s\d]+),(?<y>[-\s\d]+)> velocity=<(?<vx>[-\s\d]+),(?<vy>[-\s\d]+)>/;

    let points: Point[] = [];

    for (let line of input) {
        let match = matcher(line, reg);
        points.push({
            x: Number(match.groups.x),
            y: Number(match.groups.y),
            vx: Number(match.groups.vx),
            vy: Number(match.groups.vy)
        });
    }

    let lastArea = Infinity;

    let totalMinX = Math.min(...points.map(c => c.x));
    let totalMaxX = Math.max(...points.map(c => c.x));
    let totalMinY = Math.min(...points.map(c => c.y));
    let totalMaxY = Math.max(...points.map(c => c.y));

    let minX = totalMinX;
    let maxX = totalMaxX;
    let minY = totalMinY;
    let maxY = totalMaxY;

    let currentArea = (maxX - minX) * (maxY - minY);

    var stepCount = 0;

    while (currentArea < lastArea) {
        lastArea = currentArea;

        for (let p of points) {
            p.x += p.vx;
            p.y += p.vy;
        }

        minX = Math.min(...points.map(c => c.x));
        maxX = Math.max(...points.map(c => c.x));
        minY = Math.min(...points.map(c => c.y));
        maxY = Math.max(...points.map(c => c.y));

        currentArea = (maxX - minX) * (maxY - minY);
        stepCount++;
    }

    points = [];

    for (let line of input) {
        let match = matcher(line, reg);
        points.push({
            x: Number(match.groups.x),
            y: Number(match.groups.y),
            vx: Number(match.groups.vx),
            vy: Number(match.groups.vy)
        });
    }

    let grid: string[][] = [];
    let drafts: any[] = [];
    for (let y = 0; y <= totalMaxY - totalMinY; y++) {
        grid.push('.'.repeat(totalMaxX - totalMinX).split(''));
        drafts.push(console.draft(grid[y].join('')));
    }
    var currCount = 0;
    return new Promise((resolve) => {
        setInterval(() => {
            grid = [];
            for (let i = 0; i < grid.length; i++) {
                grid.push('.'.repeat(totalMaxX - totalMinX).split(''));
            }
            for (let point of points) {
                point.x += point.vx;
                point.y += point.vy;
                grid[point.y - totalMinY][point.x - totalMinX] = '#';
            }

            for (let i = 0; i < grid.length; i++) {
                drafts[i](grid[i].join(''));
            }

            if (currCount >= stepCount) {
                resolve(0);
            }
            currCount++;
        }, 1000);
    });

    
    // return new Promise((resolve) => {
    //     let grid: string[][] = [];
    //     let drafts: any[] = [];
    //     for (let i = 0; i < 10; i++) {
    //         grid.push('*'.repeat(10).split(''));
    //         drafts.push(console.draft(grid[i].toString()));
    //     }
    //     var hits = 0;
    //     var doExit = true;
    //     setInterval(function () {
    //         grid = grid.map(c1 => c1.map(c2 => c2 = String.fromCharCode(c2.charCodeAt(0) + 1)));
    //         for (let i = 0; i < drafts.length; i++) {
    //             drafts[i](grid[i].join(''));
    //         }
    //         hits++;
    
    //         if (hits >= 10) {
    //             resolve(0);
    //         }
    //     }, 1000);
    // });
}

interface Point {
    x: number;
    y: number;
    vx: number;
    vy: number;
}

const transform = transforms.lines;

const testData = {
    part1: `position=< 9,  1> velocity=< 0,  2>
position=< 7,  0> velocity=<-1,  0>
position=< 3, -2> velocity=<-1,  1>
position=< 6, 10> velocity=<-2, -1>
position=< 2, -4> velocity=< 2,  2>
position=<-6, 10> velocity=< 2, -2>
position=< 1,  8> velocity=< 1, -1>
position=< 1,  7> velocity=< 1,  0>
position=<-3, 11> velocity=< 1, -2>
position=< 7,  6> velocity=<-1, -1>
position=<-2,  3> velocity=< 1,  0>
position=<-4,  3> velocity=< 2,  0>
position=<10, -3> velocity=<-1,  1>
position=< 5, 11> velocity=< 1, -2>
position=< 4,  7> velocity=< 0, -1>
position=< 8, -2> velocity=< 0,  1>
position=<15,  0> velocity=<-2,  0>
position=< 1,  6> velocity=< 1,  0>
position=< 8,  9> velocity=< 0, -1>
position=< 3,  3> velocity=<-1,  1>
position=< 0,  5> velocity=< 0, -1>
position=<-2,  2> velocity=< 2,  0>
position=< 5, -2> velocity=< 1,  2>
position=< 1,  4> velocity=< 2,  1>
position=<-2,  7> velocity=< 2, -2>
position=< 3,  6> velocity=<-1, -1>
position=< 5,  0> velocity=< 1,  0>
position=<-6,  0> velocity=< 2,  0>
position=< 5,  9> velocity=< 1, -2>
position=<14,  7> velocity=<-2,  0>
position=<-3,  6> velocity=< 2, -1>`,
    part2: ``
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };