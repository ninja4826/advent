import { transforms } from 'advent-of-code-client';
// import { logger, matcher, progBar, zip } from '../util';

export function part1(_input: string[]): number | string {
    
    const height = 6;
    const width = 50;

    // const height = 3;
    // const width = 7;

    const input = _input.map(i => i.split(' '));
    let grid: boolean[][] = [];

    for (let i = 0; i < height; i++) {
        grid.push(new Array(width).fill(false));
    }

    for (let inp of input) {
        if (inp[0] === 'rotate') {
            if (inp[1] === 'row') {
                let rowNum = +inp[2].split('=')[1];
                let iter = +inp[4];
                let row = grid[rowNum];
                for (let i = 0; i < iter; i++) {
                    row.unshift(<boolean>row.pop());
                }
            } else {
                let colNum = +inp[2].split('=')[1];
                let iter = +inp[4];
                
                for (let i = 0; i < iter; i++) {
                    let lastVal = grid[grid.length - 1].slice(0)[colNum];

                    // for (let j = 1; j < grid.length; j++) {
                    //     grid[j][colNum] = grid[j-1][colNum];
                    // }
                    for (let j = grid.length - 1; j > 0; j--) {
                        grid[j][colNum] = grid[j-1][colNum];
                    }
                    grid[0][colNum] = lastVal;
                }
            }
        } else if (inp[0] === 'rect') {
            let split = inp[1].split('x');
            console.log(split);
            let x = +split[0];
            let y = +split[1];

            for (let i = 0; i < y; i++) {
                for (let j = 0; j < x; j++) {
                    grid[i][j] = true;
                }
            }
        }

        console.log(grid.map(g => g.map(g2 => g2 ? '#' : '.').join('')).join('\n'));
        console.log('');
    }

    return grid.flat(2).filter(g => g).length;
}

export function part2(input: string[]): number | string {
    return 0;
}

const transform = transforms.lines;
// const transform = (d: string): string => d;

const testData = {
    part1: [`rect 3x2
rotate column x=1 by 1
rotate row y=0 by 4
rotate column x=1 by 1`],
    part2: [``]
};

const testAnswers = {
    part1: 0,
    part2: 0
};

export { transform, testData, testAnswers };